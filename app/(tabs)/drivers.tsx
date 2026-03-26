import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { dataService } from "@/services/dataService";
import { Driver, Vehicle, formatCurrency } from "@/types";
import {
  Users,
  Phone,
  Calendar,
  Plus,
  ChevronRight,
  User,
  Trash2,
  WifiOff,
} from "lucide-react-native";

export default function DriversScreen() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const d = await dataService.getDrivers();
    const v = await dataService.getVehicles();
    setDrivers(d);
    setVehicles(v);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getVehiclePlate = (id: string) => {
    return vehicles.find((v) => v.id === id)?.plate || "Nenhum";
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Eliminar Motorista",
      "Tem certeza que deseja remover este motorista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await dataService.deleteDriver(id);
            fetchData();
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
        ListHeaderComponent={() => (
          <View className="mb-4">
            <Text className="text-slate-400 text-sm">
              Controle de motoristas e funcionários
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-100 shadow-sm shadow-slate-100 flex-row items-center justify-between">
            <TouchableOpacity
              className="flex-row items-center flex-1"
              onPress={() =>
                router.push({
                  pathname: "/modals/driver-details",
                  params: { id: item.id },
                })
              }
            >
              <View className="bg-slate-100 p-3 rounded-full mr-4">
                <User color="#64748b" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-bold text-lg">
                  {item.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Phone color="#94a3b8" size={12} className="mr-1" />
                  <Text className="text-slate-500 text-xs mr-3">
                    {item.phone}
                  </Text>
                  <Calendar color="#94a3b8" size={12} className="mr-1" />
                  <Text className="text-slate-500 text-xs">
                    Desde {new Date(item.startDate).toLocaleDateString()}
                  </Text>
                </View>
                <View className="flex-row items-center mt-2">
                  <View className="bg-blue-50 px-2 py-0.5 rounded mr-2">
                    <Text className="text-blue-600 text-[10px] font-bold">
                      Veículo: {getVehiclePlate(item.assignedVehicleId)}
                    </Text>
                  </View>
                  <View className="bg-emerald-50 px-2 py-0.5 rounded">
                    <Text className="text-emerald-600 text-[10px] font-bold">
                      {formatCurrency(item.weeklyAmount)}
                    </Text>
                  </View>
                  {item.synced === 0 && (
                    <View className="ml-2 bg-slate-100 px-1.5 rounded">
                      <WifiOff size={10} color="#94a3b8" />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>

            <View className="items-end">
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="mb-2 p-1"
              >
                <Trash2 color="#EF4444" size={18} />
              </TouchableOpacity>
              <ChevronRight color="#CBD5E1" size={20} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="mt-20 items-center justify-center">
            <Users color="#CBD5E1" size={64} strokeWidth={1} />
            <Text className="text-slate-400 mt-4 text-center">
              Nenhum motorista registrado.
            </Text>
          </View>
        )}
      />

      <Link href="/modals/add-driver" asChild>
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-blue-500/40"
          activeOpacity={0.8}
        >
          <Plus color="white" size={28} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
