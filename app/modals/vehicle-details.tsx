import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Car, Bike, Trash2, Save, WifiOff } from "lucide-react-native";
import { dataService } from "@/services/dataService";
import { Vehicle } from "@/types";

export default function VehicleDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const all = await dataService.getVehicles();
      const v = all.find((item) => item.id === id);
      if (v) {
        setVehicle(v);
        setPlate(v.plate);
        setModel(v.model || "");
      }
    };
    fetch();
  }, [id]);

  const handleDelete = () => {
    Alert.alert("Eliminar Veículo", "Deseja realmente remover este veículo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await dataService.deleteVehicle(id as string);
          router.back();
        },
      },
    ]);
  };

  const handleSave = async () => {
    await dataService.updateVehicle(id as string, { plate, model });
    Alert.alert("Sucesso", "Informações atualizadas.");
    router.back();
  };

  if (!vehicle) return null;

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Detalhes do Veículo",
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 color="#EF4444" size={20} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="p-4">
        <View className="items-center mb-8 py-6 bg-slate-50 rounded-3xl border border-slate-100">
          <View className="bg-white p-6 rounded-full shadow-sm mb-4">
            {vehicle.type === "carro" ? (
              <Car color="#3b82f6" size={48} />
            ) : (
              <Bike color="#6366f1" size={48} />
            )}
          </View>
          <Text className="text-slate-900 font-black text-2xl">{plate}</Text>
          <Text className="text-slate-400 font-medium">{model}</Text>

          <View
            className={`mt-4 px-3 py-1 rounded-full ${vehicle.status === "disponivel" ? "bg-emerald-100" : "bg-blue-100"} flex-row items-center`}
          >
            <Text
              className={`text-xs font-bold uppercase ${vehicle.status === "disponivel" ? "text-emerald-700" : "text-blue-700"}`}
            >
              {vehicle.status}
            </Text>
            {vehicle.synced === 0 && (
              <WifiOff size={10} color="#94a3b8" className="ml-2" />
            )}
          </View>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">
              Matrícula
            </Text>
            <TextInput
              value={plate}
              onChangeText={setPlate}
              className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-900 font-bold"
            />
          </View>

          <View>
            <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">
              Modelo
            </Text>
            <TextInput
              value={model}
              onChangeText={setModel}
              className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-900"
            />
          </View>
        </View>

        <View className="mt-10 flex-row space-x-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-slate-100 p-4 rounded-2xl items-center"
          >
            <Text className="text-slate-600 font-bold">Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="flex-[2] bg-blue-500 p-4 rounded-2xl items-center shadow-lg shadow-blue-500/30"
          >
            <View className="flex-row items-center">
              <Text className="text-white font-bold">Guardar Alterações</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
