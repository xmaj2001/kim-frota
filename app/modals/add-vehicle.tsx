import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Car, Bike, X } from "lucide-react-native";

export default function RegisterVehicle() {
  const router = useRouter();
  const [type, setType] = React.useState<"carro" | "mota">("carro");

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Novo Veículo",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X color="#64748b" size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="p-4">
        <Text className="text-slate-900 font-bold text-lg mb-4">
          Escolha o tipo
        </Text>

        <View className="flex-row space-x-4 mb-8">
          <TouchableOpacity
            onPress={() => setType("carro")}
            className={`flex-1 p-4 rounded-2xl border-2 items-center ${type === "carro" ? "border-blue-500 bg-blue-50" : "border-slate-100"}`}
          >
            <Car color={type === "carro" ? "#3b82f6" : "#94a3b8"} size={32} />
            <Text
              className={`mt-2 font-bold ${type === "carro" ? "text-blue-600" : "text-slate-500"}`}
            >
              Carro
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setType("mota")}
            className={`flex-1 p-4 rounded-2xl border-2 items-center ${type === "mota" ? "border-blue-500 bg-blue-50" : "border-slate-100"}`}
          >
            <Bike color={type === "mota" ? "#3b82f6" : "#94a3b8"} size={32} />
            <Text
              className={`mt-2 font-bold ${type === "mota" ? "text-blue-600" : "text-slate-500"}`}
            >
              Mota
            </Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Matrícula / Identificador"
          placeholder="Ex: LD-00-00-XX"
        />
        <Input label="Modelo" placeholder="Ex: Toyota Vitz" />
        <Input
          label="Valor Semanal (Kz)"
          placeholder="Ex: 50.000"
          keyboardType="numeric"
        />

        <TouchableOpacity className="bg-blue-500 p-4 rounded-2xl mt-8 shadow-lg shadow-blue-500/30">
          <Text className="text-white text-center font-bold text-lg">
            Registar Veículo
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Input({ label, ...props }: any) {
  return (
    <View className="mb-4">
      <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">
        {label}
      </Text>
      <TextInput
        className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-900"
        placeholderTextColor="#94a3b8"
        {...props}
      />
    </View>
  );
}
