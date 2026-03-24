import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { REPORT_STATS, formatCurrency } from "@/constants/mockData";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Download,
  Share2,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function ReportsScreen() {
  const handleGenerateReport = () => {
    Alert.alert(
      "Gerar Relatório",
      "Deseja gerar o relatório semanal detalhado em PDF?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Gerar PDF",
          onPress: () =>
            Alert.alert(
              "Sucesso",
              "Relatório gerado e salvo na pasta de documentos.",
            ),
        },
      ],
    );
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-6 flex-row justify-between items-center">
        <Text className="text-slate-400 text-sm">
          Análise de desempenho financeiro
        </Text>
        <TouchableOpacity
          onPress={handleGenerateReport}
          className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-100"
        >
          <Download color="#3b82f6" size={20} />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View className="bg-blue-600 p-6 rounded-[32px] mb-6 shadow-xl shadow-blue-600/30">
        <View className="flex-row justify-between items-center mb-6">
          <View className="bg-white/20 p-2 rounded-xl">
            <TrendingUp color="white" size={20} />
          </View>
          <Text className="text-white/60 text-xs font-black uppercase tracking-widest">
            Semana Atual
          </Text>
        </View>
        <Text className="text-white text-4xl font-black mb-1">
          {formatCurrency(REPORT_STATS.totalReceived)}
        </Text>
        <Text className="text-white/60 text-xs font-medium">
          Acumulado Recebido até hoje
        </Text>

        <View className="mt-8 pt-6 border-t border-white/10 flex-row justify-between">
          <View>
            <Text className="text-white/40 text-[10px] uppercase font-black mb-1">
              Pendente
            </Text>
            <Text className="text-white font-bold">
              {formatCurrency(REPORT_STATS.pendingAmount)}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-white/40 text-[10px] uppercase font-black mb-1">
              Atrasado
            </Text>
            <Text className="text-white font-bold text-red-300">
              {formatCurrency(REPORT_STATS.overdueAmount)}
            </Text>
          </View>
        </View>
      </View>

      {/* Reports Actions */}
      <TouchableOpacity
        onPress={handleGenerateReport}
        className="bg-white p-5 rounded-[24px] mb-6 flex-row items-center justify-between border border-slate-100 shadow-sm"
      >
        <View className="flex-row items-center">
          <View className="bg-blue-50 p-3 rounded-2xl mr-4">
            <BarChart3 color="#3b82f6" size={24} />
          </View>
          <View>
            <Text className="text-slate-900 font-bold text-lg">
              Gerar Relatório
            </Text>
            <Text className="text-slate-400 text-xs">
              Exportar dados em PDF ou Excel
            </Text>
          </View>
        </View>
        <View className="bg-slate-50 p-2 rounded-full">
          <Share2 color="#94a3b8" size={20} />
        </View>
      </TouchableOpacity>

      {/* Visual Charts Placeholders */}
      <View className="bg-white p-6 rounded-[32px] border border-slate-100 mb-6 shadow-sm">
        <View className="flex-row items-center mb-8">
          <DollarSign color="#3b82f6" size={20} className="mr-2" />
          <Text className="text-slate-900 font-black text-lg">
            Meta de Arrecadação
          </Text>
        </View>

        <View className="space-y-6">
          <BarItem
            label="Geral"
            value={REPORT_STATS.totalReceived}
            total={
              REPORT_STATS.totalReceived +
              REPORT_STATS.pendingAmount +
              REPORT_STATS.overdueAmount
            }
            color="bg-blue-500"
          />
          <BarItem
            label="Carros"
            value={REPORT_STATS.totalReceived * 0.7}
            total={500000}
            color="bg-indigo-400"
          />
          <BarItem
            label="Motas"
            value={REPORT_STATS.totalReceived * 0.3}
            total={200000}
            color="bg-emerald-400"
          />
        </View>
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}

function BarItem({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = Math.round((value / total) * 100);
  return (
    <View className="mb-6">
      <View className="flex-row justify-between mb-2 items-end">
        <View>
          <Text className="text-slate-900 font-bold text-sm mb-0.5">
            {label}
          </Text>
          <Text className="text-slate-400 text-[10px] uppercase font-black">
            {formatCurrency(value)} / {formatCurrency(total)}
          </Text>
        </View>
        <Text className="text-slate-900 text-sm font-black">{percentage}%</Text>
      </View>
      <View className="h-3 bg-slate-50 rounded-full w-full overflow-hidden border border-slate-100">
        <View
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}
