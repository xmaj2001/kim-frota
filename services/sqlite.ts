import * as SQLite from "expo-sqlite";
import { Vehicle, Driver, Payment } from "../types";

const db = SQLite.openDatabaseSync("kimfrota.db");

export const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        plate TEXT NOT NULL,
        status TEXT NOT NULL,
        model TEXT,
        synced INTEGER DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS drivers (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        startDate TEXT NOT NULL,
        weeklyAmount REAL NOT NULL,
        assignedVehicleId TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY NOT NULL,
        driverId TEXT NOT NULL,
        driverName TEXT,
        vehicleId TEXT NOT NULL,
        amount REAL NOT NULL,
        dueDate TEXT NOT NULL,
        status TEXT NOT NULL,
        weekNumber INTEGER NOT NULL,
        synced INTEGER DEFAULT 0
      );
    `);
    console.log("📂 [SQLite] Tabelas prontas, banco tá a bater!");
  } catch (error) {
    console.error("❌ [SQLite] Deu pau a criar as tabelas:", error);
  }
};

export const sqliteService = {
  // Veículos
  getVehicles: (): Vehicle[] => {
    try {
      const data = db.getAllSync("SELECT * FROM vehicles");
      console.log(`📊 [SQLite] A buscar ${data.length} veículos...`);
      return data as Vehicle[];
    } catch (error) {
      console.error("❌ [SQLite] Erro ao buscar veículos:", error);
      return [];
    }
  },
  upsertVehicle: (vehicle: Vehicle) => {
    try {
      db.runSync(
        "INSERT OR REPLACE INTO vehicles (id, type, plate, status, model, synced) VALUES (?, ?, ?, ?, ?, ?)",
        [
          vehicle.id,
          vehicle.type,
          vehicle.plate,
          vehicle.status,
          vehicle.model || null,
          vehicle.synced || 0,
        ],
      );
      console.log(`✅ [SQLite] Veículo ${vehicle.plate} guardado/atualizado.`);
    } catch (error) {
      console.error(
        `❌ [SQLite] Falha ao guardar veículo ${vehicle.plate}:`,
        error,
      );
    }
  },
  getUnsyncedVehicles: (): Vehicle[] => {
    return db.getAllSync(
      "SELECT * FROM vehicles WHERE synced = 0",
    ) as Vehicle[];
  },
  markVehicleSynced: (id: string) => {
    db.runSync("UPDATE vehicles SET synced = 1 WHERE id = ?", [id]);
    console.log(`🔄 [SQLite] Veículo ${id} marcado como sincronizado.`);
  },
  deleteVehicle: (id: string) => {
    try {
      db.runSync("DELETE FROM vehicles WHERE id = ?", [id]);
      console.log(`🗑️ [SQLite] Veículo ${id} removido do banco local.`);
    } catch (error) {
      console.error(`❌ [SQLite] Erro ao apagar veículo ${id}:`, error);
    }
  },

  // Motoristas
  getDrivers: (): Driver[] => {
    try {
      const data = db.getAllSync("SELECT * FROM drivers");
      console.log(`📊 [SQLite] A buscar ${data.length} motoristas...`);
      return data as Driver[];
    } catch (error) {
      console.error("❌ [SQLite] Erro ao buscar motoristas:", error);
      return [];
    }
  },
  upsertDriver: (driver: Driver) => {
    try {
      db.runSync(
        "INSERT OR REPLACE INTO drivers (id, name, phone, startDate, weeklyAmount, assignedVehicleId, synced) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          driver.id,
          driver.name,
          driver.phone,
          driver.startDate,
          driver.weeklyAmount,
          driver.assignedVehicleId,
          driver.synced || 0,
        ],
      );
      console.log(`✅ [SQLite] Motorista ${driver.name} guardado/atualizado.`);
    } catch (error) {
      console.error(
        `❌ [SQLite] Falha ao guardar motorista ${driver.name}:`,
        error,
      );
    }
  },
  getUnsyncedDrivers: (): Driver[] => {
    return db.getAllSync("SELECT * FROM drivers WHERE synced = 0") as Driver[];
  },
  markDriverSynced: (id: string) => {
    db.runSync("UPDATE drivers SET synced = 1 WHERE id = ?", [id]);
    console.log(`🔄 [SQLite] Motorista ${id} marcado como sincronizado.`);
  },
  deleteDriver: (id: string) => {
    try {
      db.runSync("DELETE FROM drivers WHERE id = ?", [id]);
      console.log(`🗑️ [SQLite] Motorista ${id} removido.`);
    } catch (error) {
      console.error(`❌ [SQLite] Erro ao apagar motorista ${id}:`, error);
    }
  },

  // Pagamentos
  getPayments: (): Payment[] => {
    try {
      const data = db.getAllSync("SELECT * FROM payments");
      console.log(`📊 [SQLite] A buscar ${data.length} pagamentos...`);
      return data as Payment[];
    } catch (error) {
      console.error("❌ [SQLite] Erro ao buscar pagamentos:", error);
      return [];
    }
  },
  upsertPayment: (payment: Payment) => {
    try {
      db.runSync(
        "INSERT OR REPLACE INTO payments (id, driverId, driverName, vehicleId, amount, dueDate, status, weekNumber, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          payment.id,
          payment.driverId,
          payment.driverName || null,
          payment.vehicleId,
          payment.amount,
          payment.dueDate,
          payment.status,
          payment.weekNumber,
          payment.synced || 0,
        ],
      );
      // Log discreto para não encher o terminal com 4 pagamentos de uma vez
    } catch (error) {
      console.error(
        `❌ [SQLite] Falha ao guardar pagamento ${payment.id}:`,
        error,
      );
    }
  },
  getUnsyncedPayments: (): Payment[] => {
    return db.getAllSync(
      "SELECT * FROM payments WHERE synced = 0",
    ) as Payment[];
  },
  markPaymentSynced: (id: string) => {
    db.runSync("UPDATE payments SET synced = 1 WHERE id = ?", [id]);
  },
};
