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
import {
  User,
  Phone,
  Calendar,
  Trash2,
  Save,
  Car,
  DollarSign,
} from "lucide-react-native";
import {
  MOCK_DRIVERS,
  MOCK_VEHICLES,
  formatCurrency,
} from "@/constants/mockData";
import { dataService } from "@/services/dataService";

export default function DriverDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const driver = MOCK_DRIVERS.find((d) => d.id === id) || MOCK_DRIVERS[0];
  const vehicle = MOCK_VEHICLES.find((v) => v.id === driver.assignedVehicleId);

  const [name, setName] = React.useState(driver.name);
  const [phone, setPhone] = React.useState(driver.phone);
  const [amount, setAmount] = React.useState(driver.weeklyAmount.toString());

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Motorista",
      "Deseja realmente remover este motorista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            dataService.deleteDriver(driver.id);
            router.back();
          },
        },
      ],
    );
  };

  const handleSave = () => {
    dataService.updateDriver(driver.id, {
      name,
      phone,
      weeklyAmount: parseInt(amount),
    });
    Alert.alert("Sucesso", "Informações atualizadas.");
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Detalhes do Motorista",
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 color="#EF4444" size={20} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="p-4">
        <View className="items-center mb-8 py-6 bg-slate-50 rounded-3xl border border-slate-100">
          <View className="bg-white p-6 rounded-full shadow-sm mb-4 border-4 border-slate-100">
            <User color="#64748b" size={48} />
          </View>
          <Text className="text-slate-900 font-black text-2xl">
            {driver.name}
          </Text>
          <View className="flex-row items-center mt-2">
            <Phone color="#94a3b8" size={14} className="mr-1" />
            <Text className="text-slate-500 font-medium">{driver.phone}</Text>
          </View>

          <View className="mt-4 bg-blue-500 px-4 py-2 rounded-2xl shadow-sm shadow-blue-500/30">
            <Text className="text-white font-black">
              {formatCurrency(parseInt(amount))}/Semana
            </Text>
          </View>
        </View>

        <View className="space-y-4">
          <SectionTitle title="Informações Pessoais" />
          <Input label="Nome Completo" value={name} onChangeText={setName} />
          <Input
            label="Telefone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <SectionTitle title="Financeiro" />
          <Input
            label="Valor Semanal (Kz)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <SectionTitle title="Vínculo de Veículo" />
          <TouchableOpacity className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-row items-center justify-between mb-10">
            <View className="flex-row items-center">
              <View className="bg-white p-2 rounded-xl mr-3 shadow-sm">
                <Car color="#3b82f6" size={20} />
              </View>
              <View>
                <Text className="text-slate-900 font-bold">
                  {vehicle?.plate || "Sem veículo"}
                </Text>
                <Text className="text-slate-400 text-xs">
                  {vehicle?.model || "Desconhecido"}
                </Text>
              </View>
            </View>
            <Text className="text-blue-500 font-bold text-xs">Alterar</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 flex-row space-x-4 mb-10">
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

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 mt-4 ml-1">
      {title}
    </Text>
  );
}

function Input({ label, ...props }: any) {
  return (
    <View className="mb-4">
      <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">
        {label}
      </Text>
      <TextInput
        className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-900 font-semibold"
        placeholderTextColor="#94a3b8"
        {...props}
      />
    </View>
  );
}
