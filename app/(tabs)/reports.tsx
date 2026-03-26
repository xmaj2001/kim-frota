import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { dataService } from "@/services/dataService";
import { Payment, formatCurrency } from "@/types";
import { PieChart, BarChart2, TrendingUp, Download } from "lucide-react-native";

export default function ReportsScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const all = await dataService.getPayments();

    const paid = all
      .filter((p) => p.status === "pago")
      .reduce((s, p) => s + p.amount, 0);
    const pending = all
      .filter((p) => p.status === "pendente")
      .reduce((s, p) => s + p.amount, 0);
    const overdue = all
      .filter((p) => p.status === "atrasado")
      .reduce((s, p) => s + p.amount, 0);

    setStats({ total: paid + pending + overdue, paid, pending, overdue });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateReport = () => {
    Alert.alert(
      "Sucesso",
      "Relatório financeiro gerado e pronto para download.",
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className="p-4"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
      >
        <View className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
          <Text className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
            Balanço Total
          </Text>
          <Text className="text-slate-900 text-4xl font-black mb-4">
            {formatCurrency(stats.total)}
          </Text>

          <View className="flex-row justify-between pt-4 border-t border-slate-50">
            <View>
              <Text className="text-emerald-500 text-xs font-bold">Pago</Text>
              <Text className="text-slate-900 font-bold">
                {formatCurrency(stats.paid)}
              </Text>
            </View>
            <View>
              <Text className="text-amber-500 text-xs font-bold">Pendente</Text>
              <Text className="text-slate-900 font-bold">
                {formatCurrency(stats.pending)}
              </Text>
            </View>
            <View>
              <Text className="text-red-500 text-xs font-bold">Atrasado</Text>
              <Text className="text-slate-900 font-bold">
                {formatCurrency(stats.overdue)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleGenerateReport}
          className="bg-blue-500 p-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-500/30 mb-8"
        >
          <Download color="white" size={20} className="mr-2" />
          <Text className="text-white font-bold text-lg">
            Gerar Relatório Completo
          </Text>
        </TouchableOpacity>

        <View className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <Text className="text-slate-900 font-bold text-lg mb-6 flex-row items-center">
            <PieChart color="#3b82f6" size={20} className="mr-2" /> Distribuição
            de Receita
          </Text>

          <View className="space-y-4">
            <ProgressBar
              label="Pago"
              amount={stats.paid}
              total={stats.total}
              color="bg-emerald-500"
            />
            <ProgressBar
              label="Pendente"
              amount={stats.pending}
              total={stats.total}
              color="bg-amber-500"
            />
            <ProgressBar
              label="Atrasado"
              amount={stats.overdue}
              total={stats.total}
              color="bg-red-500"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ProgressBar({ label, amount, total, color }: any) {
  const percentage = total > 0 ? (amount / total) * 100 : 0;
  return (
    <View>
      <View className="flex-row justify-between mb-1.5 px-1">
        <Text className="text-slate-500 text-xs font-bold">{label}</Text>
        <Text className="text-slate-900 text-xs font-bold">
          {Math.round(percentage)}%
        </Text>
      </View>
      <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <View
          className={`h-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}
