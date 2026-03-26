import NetInfo from "@react-native-community/netinfo";
import { db as firestore } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { sqliteService } from "./sqlite";
import { Vehicle, Driver, Payment, getPaymentStatus } from "../types";
import * as Crypto from "expo-crypto";

export const dataService = {
  async isOnline() {
    const state = await NetInfo.fetch();
    const online = !!state.isConnected;
    if (online) {
      console.log("🌐 [Status] Estamos ONLINE. A ligar ao Firebase...");
    } else {
      console.log(
        "📴 [Status] Estamos OFFLINE. A usar apenas banco local (SQLite).",
      );
    }
    return online;
  },

  // Veículos
  async getVehicles(): Promise<Vehicle[]> {
    if (await this.isOnline()) {
      try {
        console.log("☁️ [Firebase] A descarregar veículos do Firestore...");
        const querySnapshot = await getDocs(collection(firestore, "vehicles"));
        const vehicles: Vehicle[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Vehicle;
          vehicles.push(data);
          sqliteService.upsertVehicle({ ...data, synced: 1 });
        });
        console.log(
          `✅ [Firebase] ${vehicles.length} veículos sincronizados com sucesso.`,
        );
        return vehicles;
      } catch (e) {
        console.error("❌ [Firebase] Deu erro ao buscar no Firestore:", e);
      }
    }
    return sqliteService.getVehicles();
  },

  async addVehicle(vehicle: Omit<Vehicle, "id" | "synced">) {
    const id = Crypto.randomUUID();
    const newVehicle: Vehicle = { ...vehicle, id, synced: 0 };

    console.log(`📝 [Fluxo] A registar novo veículo: ${vehicle.plate}`);
    sqliteService.upsertVehicle(newVehicle);

    if (await this.isOnline()) {
      try {
        await setDoc(doc(firestore, "vehicles", id), {
          ...newVehicle,
          synced: 1,
        });
        sqliteService.markVehicleSynced(id);
        console.log("☁️ [Firebase] Veículo enviado para a nuvem.");
      } catch (e) {
        console.error(
          "❌ [Firebase] Não conseguimos enviar o veículo agora:",
          e,
        );
      }
    }
    return newVehicle;
  },

  async updateVehicle(id: string, data: Partial<Vehicle>) {
    console.log(`📝 [Fluxo] A atualizar veículo: ${id}`);
    const existing = sqliteService.getVehicles().find((v) => v.id === id);
    if (!existing) return;

    const updated = { ...existing, ...data, synced: 0 };
    sqliteService.upsertVehicle(updated);

    if (await this.isOnline()) {
      try {
        await updateDoc(doc(firestore, "vehicles", id), { ...data, synced: 1 });
        sqliteService.markVehicleSynced(id);
        console.log("☁️ [Firebase] Alterações enviadas para o Firestore.");
      } catch (e) {
        console.error("❌ [Firebase] Erro ao atualizar na nuvem:", e);
      }
    }
  },

  async deleteVehicle(id: string) {
    console.log(`📝 [Fluxo] A apagar veículo: ${id}`);
    sqliteService.deleteVehicle(id);

    if (await this.isOnline()) {
      try {
        await setDoc(doc(firestore, "vehicles", id), {
          deleted: true,
          synced: 1,
        });
        console.log("☁️ [Firebase] Marcado como apagado na nuvem.");
      } catch (e) {
        console.error("❌ [Firebase] Erro ao apagar na nuvem:", e);
      }
    }
  },

  // Motoristas
  async getDrivers(): Promise<Driver[]> {
    if (await this.isOnline()) {
      try {
        console.log("☁️ [Firebase] A buscar motoristas no Firestore...");
        const querySnapshot = await getDocs(collection(firestore, "drivers"));
        const drivers: Driver[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Driver;
          drivers.push(data);
          sqliteService.upsertDriver({ ...data, synced: 1 });
        });
        return drivers;
      } catch (e) {
        console.error("❌ [Firebase] Falha ao sincronizar motoristas:", e);
      }
    }
    return sqliteService.getDrivers();
  },

  async addDriver(driver: Omit<Driver, "id" | "synced">) {
    const id = Crypto.randomUUID();
    const newDriver: Driver = { ...driver, id, synced: 0 };

    console.log(`📝 [Fluxo] A registar novo motorista: ${driver.name}`);
    sqliteService.upsertDriver(newDriver);

    const payments = this.generateWeeklyPayments(newDriver);
    console.log(
      `📅 [Fluxo] ${payments.length} pagamentos gerados automaticamente.`,
    );
    for (const p of payments) {
      sqliteService.upsertPayment(p);
    }

    if (await this.isOnline()) {
      try {
        await setDoc(doc(firestore, "drivers", id), {
          ...newDriver,
          synced: 1,
        });
        sqliteService.markDriverSynced(id);

        const batch = writeBatch(firestore);
        for (const p of payments) {
          const pRef = doc(firestore, "payments", p.id);
          batch.set(pRef, { ...p, synced: 1 });
        }
        await batch.commit();
        for (const p of payments) {
          sqliteService.markPaymentSynced(p.id);
        }
        console.log("☁️ [Firebase] Motorista e pagamentos sincronizados.");
      } catch (e) {
        console.error("❌ [Firebase] Houve um problema no envio inicial:", e);
      }
    }
    return newDriver;
  },

  async updateDriver(id: string, data: Partial<Driver>) {
    console.log(`📝 [Fluxo] A editar motorista: ${id}`);
    const existing = sqliteService.getDrivers().find((d) => d.id === id);
    if (!existing) return;
    const updated = { ...existing, ...data, synced: 0 };
    sqliteService.upsertDriver(updated);

    if (await this.isOnline()) {
      try {
        await updateDoc(doc(firestore, "drivers", id), { ...data, synced: 1 });
        sqliteService.markDriverSynced(id);
      } catch (e) {
        console.error("❌ [Firebase] Erro na edição remota:", e);
      }
    }
  },

  async deleteDriver(id: string) {
    console.log(`📝 [Fluxo] A remover motorista: ${id}`);
    sqliteService.deleteDriver(id);
    if (await this.isOnline()) {
      try {
        await setDoc(doc(firestore, "drivers", id), {
          deleted: true,
          synced: 1,
        });
      } catch (e) {
        console.error("❌ [Firebase] Erro ao remover da nuvem:", e);
      }
    }
  },

  generateWeeklyPayments(driver: Driver): Payment[] {
    const payments: Payment[] = [];
    let date = new Date(driver.startDate);

    for (let i = 0; i < 4; i++) {
      payments.push({
        id: Crypto.randomUUID(),
        driverId: driver.id,
        driverName: driver.name,
        vehicleId: driver.assignedVehicleId,
        amount: driver.weeklyAmount,
        dueDate: date.toISOString(),
        status: "pendente",
        weekNumber: i + 1,
        synced: 0,
      });

      date.setDate(date.getDate() + 7);
    }

    return payments;
  },

  // Pagamentos
  async getPayments(): Promise<Payment[]> {
    let rawPayments: Payment[] = [];
    if (await this.isOnline()) {
      try {
        console.log("☁️ [Firebase] A buscar histórico de pagamentos...");
        const querySnapshot = await getDocs(collection(firestore, "payments"));
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Payment;
          rawPayments.push(data);
          sqliteService.upsertPayment({ ...data, synced: 1 });
        });
      } catch (e) {
        console.error("❌ [Firebase] Erro ao buscar pagamentos:", e);
        rawPayments = sqliteService.getPayments();
      }
    } else {
      rawPayments = sqliteService.getPayments();
    }

    return rawPayments.map((p) => ({
      ...p,
      status: getPaymentStatus(p),
    }));
  },

  async markPaymentPaid(id: string) {
    console.log(`📝 [Fluxo] A confirmar pagamento: ${id}`);
    const existing = sqliteService.getPayments().find((p) => p.id === id);
    if (!existing) return;

    sqliteService.upsertPayment({ ...existing, status: "pago", synced: 0 });

    if (await this.isOnline()) {
      try {
        await updateDoc(doc(firestore, "payments", id), {
          status: "pago",
          synced: 1,
        });
        sqliteService.markPaymentSynced(id);
        console.log("☁️ [Firebase] Pagamento confirmado no Firestore.");
      } catch (e) {
        console.error("❌ [Firebase] Erro ao confirmar na nuvem:", e);
      }
    }
  },
};
