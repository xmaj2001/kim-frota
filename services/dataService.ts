import {
  MOCK_VEHICLES,
  MOCK_DRIVERS,
  MOCK_PAYMENTS,
  Vehicle,
  Driver,
  Payment,
} from "@/constants/mockData";

export const dataService = {
  // Veículos
  getVehicles: (): Vehicle[] => MOCK_VEHICLES,
  getVehicleById: (id: string) => MOCK_VEHICLES.find((v) => v.id === id),

  updateVehicle: (id: string, data: Partial<Vehicle>) => {
    console.log(`Atualizar veículo ${id}:`, data);
  },

  deleteVehicle: (id: string) => {
    console.log(`Eliminar veículo: ${id}`);
  },

  // Motoristas
  getDrivers: (): Driver[] => MOCK_DRIVERS,
  getDriverById: (id: string) => MOCK_DRIVERS.find((d) => d.id === id),

  updateDriver: (id: string, data: Partial<Driver>) => {
    console.log(`Atualizar motorista ${id}:`, data);
  },

  deleteDriver: (id: string) => {
    console.log(`Eliminar motorista: ${id}`);
  },

  // Pagamentos
  getPayments: (): Payment[] => MOCK_PAYMENTS,

  markAsPaid: (id: string) => {
    console.log(`Marcar pagamento como pago: ${id}`);
  },

  filterPayments: (status: string | null) => {
    if (!status) return MOCK_PAYMENTS;
    return MOCK_PAYMENTS.filter((p) => p.status === status);
  },
};
