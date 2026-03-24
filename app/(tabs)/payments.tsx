import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { MOCK_PAYMENTS, formatCurrency } from "@/constants/mockData";
import {
  ReceiptText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  CheckCircle,
  Check,
  X,
} from "lucide-react-native";
import { dataService } from "@/services/dataService";

export default function PaymentsScreen() {
  const [filter, setFilter] = React.useState<string | null>(null);
  const [showFilter, setShowFilter] = React.useState(false);

  const filteredPayments = dataService.filterPayments(filter);

  const getStatusLabel = (s: string | null) => {
    if (!s) return "Todos";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-4 py-3 flex-row justify-between items-center bg-white border-b border-slate-100">
        <View>
          <Text className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-0.5">
            Filtro Ativo
          </Text>
          <Text className="text-slate-900 font-black text-sm">
            {getStatusLabel(filter)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowFilter(true)}
          className={`p-3 rounded-2xl border ${filter ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"} shadow-sm`}
        >
          <Filter color={filter ? "#3b82f6" : "#64748b"} size={18} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPayments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white p-5 rounded-[28px] mb-4 border border-slate-100 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center flex-1">
                <View className="bg-slate-100 p-2.5 rounded-2xl mr-3">
                  <ReceiptText color="#64748b" size={22} />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-900 font-black text-base">
                    {item.driverName}
                  </Text>
                  <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                    Vencimento: {item.dueDate}
                  </Text>
                </View>
              </View>
              <Text className="text-slate-900 font-black text-lg">
                {formatCurrency(item.amount)}
              </Text>
            </View>

            <View className="h-[1px] bg-slate-50 w-full mb-4" />

            <View className="flex-row items-center justify-between">
              <StatusBadge status={item.status} />
              {item.status !== "pago" && (
                <TouchableOpacity
                  onPress={() => {
                    dataService.markAsPaid(item.id);
                    Alert.alert("Sucesso", "Pagamento liquidado com sucesso!");
                  }}
                  className="bg-emerald-500 px-5 py-2.5 rounded-2xl flex-row items-center shadow-lg shadow-emerald-500/30"
                >
                  <CheckCircle2 color="white" size={16} className="mr-2" />
                  <Text className="text-white font-black text-xs uppercase">
                    Liquidar
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="py-24 items-center justify-center">
            <View className="bg-slate-100 p-6 rounded-full mb-4">
              <ReceiptText color="#CBD5E1" size={48} strokeWidth={1} />
            </View>
            <Text className="text-slate-400 font-black text-lg">
              Nenhum registo
            </Text>
            <Text className="text-slate-300 text-sm">
              Tente mudar o filtro de busca.
            </Text>
          </View>
        )}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowFilter(false)}
      >
        <View className="flex-1 bg-black/40 justify-center px-6">
          <View className="bg-white rounded-[40px] p-8 shadow-2xl">
            <View className="flex-row justify-between items-center mb-10">
              <Text className="text-2xl font-black text-slate-900">
                Filtrar
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilter(false)}
                className="bg-slate-50 p-3 rounded-full"
              >
                <X color="#64748b" size={20} />
              </TouchableOpacity>
            </View>

            <View className="gap-y-3">
              <FilterOption
                label="Todos"
                isActive={filter === null}
                onPress={() => {
                  setFilter(null);
                  setShowFilter(false);
                }}
              />
              <FilterOption
                label="Pago"
                isActive={filter === "pago"}
                onPress={() => {
                  setFilter("pago");
                  setShowFilter(false);
                }}
              />
              <FilterOption
                label="Pendente"
                isActive={filter === "pendente"}
                onPress={() => {
                  setFilter("pendente");
                  setShowFilter(false);
                }}
              />
              <FilterOption
                label="Atrasado"
                isActive={filter === "atrasado"}
                onPress={() => {
                  setFilter("atrasado");
                  setShowFilter(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FilterOption({ label, isActive, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-5 rounded-3xl flex-row justify-between items-center ${isActive ? "bg-blue-500 shadow-xl shadow-blue-500/40" : "bg-slate-50"}`}
    >
      <Text
        className={`text-base font-black ${isActive ? "text-white" : "text-slate-600"}`}
      >
        {label}
      </Text>
      {isActive && <Check color="white" size={20} />}
    </TouchableOpacity>
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
      bg: "bg-red-100",
      label: "ATRASADO",
      icon: <XCircle size={12} color="#EF4444" />,
    },
    pendente: {
      color: "text-amber-500",
      bg: "bg-amber-100",
      label: "PENDENTE",
      icon: <AlertCircle size={12} color="#F59E0B" />,
    },
  };

  const config = configs[status as keyof typeof configs];

  return (
    <View
      className={`${config.bg} px-4 py-1.5 rounded-full flex-row items-center border border-white/50`}
    >
      <View className="mr-2">{config.icon}</View>
      <Text
        className={`${config.color} text-[10px] font-black uppercase tracking-widest`}
      >
        {config.label}
      </Text>
    </View>
  );
}
