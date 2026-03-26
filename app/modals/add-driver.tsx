import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import {
  User,
  X,
  Calendar,
  Car,
  ChevronDown,
  Check,
} from "lucide-react-native";
import { dataService } from "@/services/dataService";
import { Vehicle } from "@/types";

export default function RegisterDriver() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [weeklyAmount, setWeeklyAmount] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      const all = await dataService.getVehicles();
      setAvailableVehicles(all.filter((v) => v.status === "disponivel"));
    };
    fetchVehicles();
  }, []);

  const handleRegister = async () => {
    if (!name || !phone || !weeklyAmount || !selectedVehicle) {
      return Alert.alert(
        "Erro",
        "Preencha todos os campos e selecione um veículo.",
      );
    }

    await dataService.addDriver({
      name,
      phone,
      startDate,
      weeklyAmount: parseFloat(weeklyAmount),
      assignedVehicleId: selectedVehicle.id,
    });

    // Update vehicle status
    await dataService.updateVehicle?.(selectedVehicle.id, {
      status: "atribuido",
    });

    Alert.alert("Sucesso", "Motorista registado e pagamentos iniciados!");
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Novo Motorista",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X color="#64748b" size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="p-4">
        <View className="items-center mb-8">
          <View className="bg-slate-100 w-24 h-24 rounded-full items-center justify-center border-4 border-slate-50">
            <User color="#CBD5E1" size={48} />
          </View>
        </View>

        <Input
          label="Nome Completo"
          placeholder="Ex: João Manuel"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Telefone"
          placeholder="Ex: 923 000 000"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <Input
          label="Valor Semanal (Kz)"
          placeholder="Ex: 50000"
          keyboardType="numeric"
          value={weeklyAmount}
          onChangeText={setWeeklyAmount}
        />

        <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1 mt-4">
          Veículo da Frota
        </Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-row justify-between items-center mb-8"
        >
          <Text
            className={
              selectedVehicle ? "text-slate-900 font-bold" : "text-slate-400"
            }
          >
            {selectedVehicle
              ? `${selectedVehicle.plate} - ${selectedVehicle.model}`
              : "Selecionar da frota..."}
          </Text>
          <ChevronDown color="#94a3b8" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRegister}
          className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/30"
        >
          <Text className="text-white text-center font-bold text-lg">
            Registar Motorista
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Vehicle Picker Modal */}
      <Modal visible={showPicker} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-3/4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-bold">
                Selecionar Veículo Disponível
              </Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <X color="#64748b" size={24} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={availableVehicles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedVehicle(item);
                    setShowPicker(false);
                  }}
                  className="flex-row items-center p-4 mb-2 bg-slate-50 rounded-2xl"
                >
                  <View className="bg-white p-2 rounded-lg mr-4">
                    <Car color="#3b82f6" size={20} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold">{item.plate}</Text>
                    <Text className="text-slate-500 text-xs">{item.model}</Text>
                  </View>
                  {selectedVehicle?.id === item.id && (
                    <Check color="#10b981" size={20} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View className="items-center py-20">
                  <Car color="#cbd5e1" size={48} />
                  <Text className="text-slate-400 mt-2">
                    Nenhum veículo disponível
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
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
