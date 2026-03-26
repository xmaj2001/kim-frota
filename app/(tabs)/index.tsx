import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { dataService } from "@/services/dataService";
import { Vehicle, Driver, Payment, formatCurrency } from "@/types";
import {
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ReceiptText,
  Wifi,
  WifiOff,
} from "lucide-react-native";

export default function Dashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({ received: 0, pending: 0, overdue: 0 });

  const fetchData = async () => {
    setLoading(true);
    const online = await dataService.isOnline();
    setIsOnline(online);

    const allPayments = await dataService.getPayments();
    setPayments(allPayments.slice(0, 10)); // Top 10

    const received = allPayments
      .filter((p) => p.status === "pago")
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = allPayments
      .filter((p) => p.status === "pendente")
      .reduce((sum, p) => sum + p.amount, 0);
    const overdue = allPayments
      .filter((p) => p.status === "atrasado")
      .reduce((sum, p) => sum + p.amount, 0);

    setStats({ received, pending, overdue });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-slate-50 p-4"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchData} />
      }
    >
      <View className="mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-slate-400 text-sm font-medium">
            Resumo Geral
          </Text>
          <Text className="text-slate-900 text-2xl font-bold">
            Olá, Bem-vindo!
          </Text>
        </View>
        <View
          className={`${isOnline ? "bg-emerald-100" : "bg-red-100"} p-2 rounded-full flex-row items-center px-3`}
        >
          {isOnline ? (
            <Wifi size={14} color="#10b981" />
          ) : (
            <WifiOff size={14} color="#ef4444" />
          )}
          <Text
            className={`ml-2 text-[10px] font-bold ${isOnline ? "text-emerald-700" : "text-red-700"}`}
          >
            {isOnline ? "ONLINE" : "OFFLINE"}
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="flex-row flex-wrap justify-between mb-6">
        <StatCard
          title="Recebido"
          value={formatCurrency(stats.received)}
          icon={<TrendingUp color="#10B981" size={20} />}
          color="bg-emerald-50"
        />
        <StatCard
          title="Pendente"
          value={formatCurrency(stats.pending)}
          icon={<Clock color="#F59E0B" size={20} />}
          color="bg-amber-50"
        />
        <StatCard
          title="Atrasado"
          value={formatCurrency(stats.overdue)}
          icon={<AlertCircle color="#EF4444" size={20} />}
          color="bg-red-50"
        />
      </View>

      {/* Today's Payments */}
      <View className="mb-4 flex-row justify-between items-center">
        <Text className="text-lg font-bold text-slate-900">
          Pagamentos Recentes
        </Text>
        <TouchableOpacity onPress={fetchData}>
          <Text className="text-blue-500 font-medium">Ver tudo</Text>
        </TouchableOpacity>
      </View>

      {payments.map((payment) => (
        <PaymentItem key={payment.id} payment={payment} />
      ))}

      {payments.length === 0 && !loading && (
        <View className="items-center py-10">
          <ReceiptText size={48} color="#cbd5e1" strokeWidth={1} />
          <Text className="text-slate-400 mt-2">
            Nenhum pagamento registado
          </Text>
        </View>
      )}

      <View className="h-20" />
    </ScrollView>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <View
      className={`${color} p-4 rounded-2xl w-[48%] mb-4 shadow-sm shadow-slate-200 border border-white/50`}
    >
      <View className="mb-2">{icon}</View>
      <Text className="text-slate-500 text-xs mb-1">{title}</Text>
      <Text className="text-slate-900 text-lg font-bold">{value}</Text>
    </View>
  );
}

function PaymentItem({ payment }: { payment: Payment }) {
  const statusColors = {
    pago: "text-emerald-500 bg-emerald-50",
    atrasado: "text-red-500 bg-red-50",
    pendente: "text-amber-500 bg-amber-50",
  };

  return (
    <View className="bg-white p-4 rounded-xl mb-3 flex-row items-center justify-between border border-slate-100 shadow-sm shadow-slate-100">
      <View className="flex-row items-center flex-1">
        <View className="bg-slate-100 p-2 rounded-full mr-3">
          <ReceiptText color="#64748b" size={20} />
        </View>
        <View>
          <Text className="text-slate-900 font-semibold">
            {payment.driverName}
          </Text>
          <Text className="text-slate-400 text-xs">
            Semana {payment.weekNumber} •{" "}
            {new Date(payment.dueDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-slate-900 font-bold mb-1">
          {formatCurrency(payment.amount)}
        </Text>
        <View
          className={`${statusColors[payment.status]} px-2 py-0.5 rounded-full`}
        >
          <Text className="text-[10px] font-bold uppercase">
            {payment.status}
          </Text>
        </View>
      </View>
    </View>
  );
}
