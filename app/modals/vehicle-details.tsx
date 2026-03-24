import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Car, Bike, Trash2, Save, X, Info } from "lucide-react-native";
import { MOCK_VEHICLES } from "@/constants/mockData";
import { dataService } from "@/services/dataService";

export default function VehicleDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const vehicle = MOCK_VEHICLES.find((v) => v.id === id) || MOCK_VEHICLES[0];

  const [plate, setPlate] = React.useState(vehicle.plate);
  const [model, setModel] = React.useState(vehicle.model || "");

  const handleDelete = () => {
    Alert.alert("Eliminar Veículo", "Deseja realmente remover este veículo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          dataService.deleteVehicle(vehicle.id);
          router.back();
        },
      },
    ]);
  };

  const handleSave = () => {
    dataService.updateVehicle(vehicle.id, { plate, model });
    Alert.alert("Sucesso", "Informações atualizadas.");
    router.back();
  };

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
          <Text className="text-slate-900 font-black text-2xl">
            {vehicle.plate}
          </Text>
          <Text className="text-slate-400 font-medium">{vehicle.model}</Text>

          <View
            className={`mt-4 px-3 py-1 rounded-full ${vehicle.status === "disponivel" ? "bg-emerald-100" : "bg-blue-100"}`}
          >
            <Text
              className={`text-xs font-bold uppercase ${vehicle.status === "disponivel" ? "text-emerald-700" : "text-blue-700"}`}
            >
              {vehicle.status}
            </Text>
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
              <Save color="white" size={20} className="mr-2" />
              <Text className="text-white font-bold">Guardar Alterações</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
