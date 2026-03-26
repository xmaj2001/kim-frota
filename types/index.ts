export interface Vehicle {
  id: string;
  type: "carro" | "mota";
  plate: string;
  status: "disponivel" | "atribuido";
  model?: string;
  synced?: number; // 0 or 1
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  startDate: string;
  weeklyAmount: number;
  assignedVehicleId: string;
  synced?: number; // 0 or 1
}

export interface Payment {
  id: string;
  driverId: string;
  driverName?: string;
  vehicleId: string;
  amount: number;
  dueDate: string;
  status: "pago" | "pendente" | "atrasado";
  weekNumber: number;
  synced?: number; // 0 or 1
}

export function getPaymentStatus(payment: Payment) {
  const today = new Date();
  const due = new Date(payment.dueDate);

  if (payment.status === "pago") return "pago";

  if (today > due) return "atrasado";

  return "pendente";
}

export const formatCurrency = (value: number) => {
  return `${value.toLocaleString("pt-AO")} Kz`;
};
