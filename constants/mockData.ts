export interface Vehicle {
  id: string;
  type: "carro" | "mota";
  plate: string;
  status: "disponivel" | "atribuido";
  model?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  startDate: string;
  weeklyAmount: number; // Agora no Motorista
  assignedVehicleId: string;
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
}

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "v1",
    type: "carro",
    plate: "LD-12-34-AF",
    status: "atribuido",
    model: "Toyota Vitz",
  },
  {
    id: "v2",
    type: "mota",
    plate: "LD-88-99-MM",
    status: "atribuido",
    model: "LingKen",
  },
  {
    id: "v3",
    type: "carro",
    plate: "LD-44-55-BT",
    status: "disponivel",
    model: "Hyundai i10",
  },
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: "d1",
    name: "João Manuel",
    phone: "923 000 000",
    startDate: "2024-03-01",
    weeklyAmount: 50000,
    assignedVehicleId: "v1",
  },
  {
    id: "d2",
    name: "António José",
    phone: "945 111 222",
    startDate: "2024-03-05",
    weeklyAmount: 20000,
    assignedVehicleId: "v2",
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "p1",
    driverId: "d1",
    driverName: "João Manuel",
    vehicleId: "v1",
    amount: 50000,
    dueDate: "2024-03-15",
    status: "pago",
    weekNumber: 1,
  },
  {
    id: "p2",
    driverId: "d1",
    driverName: "João Manuel",
    vehicleId: "v1",
    amount: 50000,
    dueDate: "2024-03-22",
    status: "atrasado",
    weekNumber: 2,
  },
  {
    id: "p3",
    driverId: "d2",
    driverName: "António José",
    vehicleId: "v2",
    amount: 20000,
    dueDate: "2024-03-24",
    status: "pendente",
    weekNumber: 3,
  },
];

export const REPORT_STATS = {
  totalReceived: 70000,
  pendingAmount: 20000,
  overdueAmount: 50000,
  activeVehicles: 2,
  availableVehicles: 1,
};

export const formatCurrency = (value: number) => {
  return `${value.toLocaleString("pt-AO")} Kz`;
};
