import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { dataService } from "@/services/dataService";
import { Payment, formatCurrency, getPaymentStatus } from "@/types";
import {
  ReceiptText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  WifiOff,
} from "lucide-react-native";

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await dataService.getPayments();

    // Apply local filter if set
    const filtered = filter
      ? data.filter((p) => getPaymentStatus(p) === filter)
      : data;

    setPayments(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleToggleFilter = () => {
    Alert.alert("Filtrar por Status", "Escolha o status para filtrar", [
      { text: "Todos", onPress: () => setFilter(null) },
      { text: "Pago", onPress: () => setFilter("pago") },
      { text: "Pendente", onPress: () => setFilter("pendente") },
      { text: "Atrasado", onPress: () => setFilter("atrasado") },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleMarkAsPaid = async (id: string) => {
    await dataService.markPaymentPaid(id);
    fetchData();
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-4 py-3 flex-row justify-between items-center bg-white border-b border-slate-100">
        <Text className="text-slate-400 text-xs uppercase font-bold tracking-wider">
          {filter ? `Filtro: ${filter}` : "Todos os Pagamentos"}
        </Text>
        <TouchableOpacity
          onPress={handleToggleFilter}
          className="bg-slate-50 p-2 rounded-lg border border-slate-200"
        >
          <Filter color="#64748b" size={18} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
        renderItem={({ item }) => {
          const status = getPaymentStatus(item);
          return (
            <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-100 shadow-sm shadow-slate-100">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className="bg-slate-50 p-2 rounded-full mr-3">
                    <ReceiptText color="#64748b" size={20} />
                  </View>
                  <View>
                    <Text className="text-slate-900 font-bold">
                      {item.driverName}
                    </Text>
                    <Text className="text-slate-400 text-xs">
                      Vencimento: {new Date(item.dueDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-slate-900 font-extrabold text-lg">
                    {formatCurrency(item.amount)}
                  </Text>
                  {item.synced === 0 && <WifiOff size={10} color="#94a3b8" />}
                </View>
              </View>

              <View className="h-[1px] bg-slate-50 w-full mb-3" />

              <View className="flex-row items-center justify-between">
                <StatusBadge status={status} />
                {status !== "pago" && (
                  <TouchableOpacity
                    onPress={() => handleMarkAsPaid(item.id)}
                    className="bg-emerald-500 px-4 py-2 rounded-xl flex-row items-center"
                  >
                    <CheckCircle2 color="white" size={16} className="mr-2" />
                    <Text className="text-white font-bold text-xs">
                      Marcar como Pago
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs = {
    pago: {
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      label: "PAGO",
      icon: <CheckCircle2 size={12} color="#10B981" />,
    },
    atrasado: {
      color: "text-red-500",
      bg: "bg-red-50",
      label: "ATRASADO",
      icon: <XCircle size={12} color="#EF4444" />,
    },
    pendente: {
      color: "text-amber-500",
      bg: "bg-amber-50",
      label: "PENDENTE",
      icon: <AlertCircle size={12} color="#F59E0B" />,
    },
  };

  const config = configs[status as keyof typeof configs];

  return (
    <View
      className={`${config.bg} px-3 py-1 rounded-full flex-row items-center`}
    >
      <View className="mr-1.5">{config.icon}</View>
      <Text className={`${config.color} text-[10px] font-black`}>
        {config.label}
      </Text>
    </View>
  );
}
