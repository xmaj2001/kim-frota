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
import { Vehicle } from "@/types";
import {
  Car,
  Bike,
  Plus,
  ChevronRight,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react-native";

export default function VehiclesScreen() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setIsOnline(await dataService.isOnline());
    const data = await dataService.getVehicles();
    setVehicles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Eliminar Veículo",
      "Tem certeza que deseja remover este veículo da frota?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await dataService.deleteVehicle(id);
            fetchData();
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
        ListHeaderComponent={() => (
          <View className="mb-4 flex-row justify-between items-center">
            <Text className="text-slate-400 text-sm">
              Gerencie sua frota de veículos
            </Text>
            {loading && (
              <Text className="text-blue-500 text-xs">Sincronizando...</Text>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-100 shadow-sm shadow-slate-100 flex-row items-center justify-between">
            <TouchableOpacity
              className="flex-row items-center flex-1"
              onPress={() =>
                router.push({
                  pathname: "/modals/vehicle-details",
                  params: { id: item.id },
                })
              }
            >
              <View
                className={`${item.type === "carro" ? "bg-blue-50" : "bg-indigo-50"} p-3 rounded-2xl mr-4`}
              >
                {item.type === "carro" ? (
                  <Car color="#3b82f6" size={24} />
                ) : (
                  <Bike color="#6366f1" size={24} />
                )}
              </View>
              <View>
                <Text className="text-slate-900 font-bold text-lg">
                  {item.plate}
                </Text>
                <Text className="text-slate-500 text-sm">
                  {item.model || "Sem modelo"}
                </Text>
                <View className="flex-row items-center mt-1">
                  <View
                    className={`w-2 h-2 rounded-full mr-1.5 ${item.status === "disponivel" ? "bg-emerald-500" : "bg-blue-500"}`}
                  />
                  <Text
                    className={`text-xs font-medium uppercase ${item.status === "disponivel" ? "text-emerald-500" : "text-blue-500"}`}
                  >
                    {item.status}
                  </Text>
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
            <Car color="#CBD5E1" size={64} strokeWidth={1} />
            <Text className="text-slate-400 mt-4 text-center">
              Nenhum veículo registrado.
            </Text>
          </View>
        )}
      />

      <Link href="/modals/add-vehicle" asChild>
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
