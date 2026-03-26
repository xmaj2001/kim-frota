import NetInfo from "@react-native-community/netinfo";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { db as firestore } from "./firebase";
import { sqliteService } from "./sqlite";

export const syncService = {
  async pushData() {
    try {
      console.log(
        "📤 [Sync] A começar o envio de dados locais para a nuvem...",
      );

      // Veículos
      const unsyncedVehicles = sqliteService.getUnsyncedVehicles();
      if (unsyncedVehicles.length > 0) {
        console.log(
          `📤 [Sync] A enviar ${unsyncedVehicles.length} veículos...`,
        );
        for (const v of unsyncedVehicles) {
          await setDoc(doc(firestore, "vehicles", v.id), { ...v, synced: 1 });
          sqliteService.markVehicleSynced(v.id);
        }
      }

      // Motoristas
      const unsyncedDrivers = sqliteService.getUnsyncedDrivers();
      if (unsyncedDrivers.length > 0) {
        console.log(
          `📤 [Sync] A enviar ${unsyncedDrivers.length} motoristas...`,
        );
        for (const d of unsyncedDrivers) {
          await setDoc(doc(firestore, "drivers", d.id), { ...d, synced: 1 });
          sqliteService.markDriverSynced(d.id);
        }
      }

      // Pagamentos
      const unsyncedPayments = sqliteService.getUnsyncedPayments();
      if (unsyncedPayments.length > 0) {
        console.log(
          `📤 [Sync] A enviar ${unsyncedPayments.length} pagamentos pendentes...`,
        );
        const batch = writeBatch(firestore);
        for (const p of unsyncedPayments) {
          const pRef = doc(firestore, "payments", p.id);
          batch.set(pRef, { ...p, synced: 1 });
        }
        await batch.commit();
        for (const p of unsyncedPayments) {
          sqliteService.markPaymentSynced(p.id);
        }
      }

      console.log(
        "✨ [Sync] Tudo sincronizado! Dados estão a bater certo na nuvem.",
      );
    } catch (e) {
      console.error("❌ [Sync] Deu problema na sincronização:", e);
    }
  },

  async syncData() {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      console.log(
        "📴 [Sync] Sem net agora, vou tentar sincronizar mais tarde.",
      );
      return;
    }

    console.log("🔄 [Sync] Internet detectada! A iniciar sincronização...");
    await this.pushData();
  },
};
