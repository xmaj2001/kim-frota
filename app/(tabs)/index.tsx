import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  REPORT_STATS,
  MOCK_PAYMENTS,
  formatCurrency,
} from "@/constants/mockData";
import {
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ReceiptText,
} from "lucide-react-native";

export default function Dashboard() {
  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-6">
        <Text className="text-slate-400 text-sm font-medium">Resumo Geral</Text>
        <Text className="text-slate-900 text-2xl font-bold">
          Olá, Bem-vindo!
        </Text>
      </View>

      {/* Stats Cards */}
      <View className="flex-row flex-wrap justify-between mb-6">
        <StatCard
          title="Recebido"
          value={formatCurrency(REPORT_STATS.totalReceived)}
          icon={<TrendingUp color="#10B981" size={20} />}
          color="bg-emerald-50"
        />
        <StatCard
          title="Pendente"
          value={formatCurrency(REPORT_STATS.pendingAmount)}
          icon={<Clock color="#F59E0B" size={20} />}
          color="bg-amber-50"
        />
        <StatCard
          title="Atrasado"
          value={formatCurrency(REPORT_STATS.overdueAmount)}
          icon={<AlertCircle color="#EF4444" size={20} />}
          color="bg-red-50"
        />
      </View>

      {/* Today's Payments */}
      <View className="mb-4 flex-row justify-between items-center">
        <Text className="text-lg font-bold text-slate-900">
          Pagamentos Recentes
        </Text>
        <TouchableOpacity>
          <Text className="text-blue-500 font-medium">Ver tudo</Text>
        </TouchableOpacity>
      </View>

      {MOCK_PAYMENTS.map((payment) => (
        <PaymentItem key={payment.id} payment={payment} />
      ))}

      <View className="h-20" />
    </ScrollView>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) {
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

function PaymentItem({ payment }: { payment: any }) {
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
            Semana {payment.weekNumber} • {payment.dueDate}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-slate-900 font-bold mb-1">
          {formatCurrency(payment.amount)}
        </Text>
        <View
          className={`${statusColors[payment.status as keyof typeof statusColors]} px-2 py-0.5 rounded-full`}
        >
          <Text className="text-[10px] font-bold uppercase">
            {payment.status}
          </Text>
        </View>
      </View>
    </View>
  );
}
