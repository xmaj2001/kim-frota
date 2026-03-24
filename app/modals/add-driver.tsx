import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import {
  User,
  X,
  Calendar,
  Car,
  Bike,
  ChevronRight,
  Check,
} from "lucide-react-native";
import { MOCK_VEHICLES } from "@/constants/mockData";

export default function RegisterDriver() {
  const router = useRouter();
  const [showVehiclePicker, setShowVehiclePicker] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<any>(null);

  const availableVehicles = MOCK_VEHICLES.filter(
    (v) => v.status === "disponivel",
  );

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
          <Text className="text-blue-500 font-bold mt-2">Adicionar Foto</Text>
        </View>

        <Input label="Nome Completo" placeholder="Ex: João Manuel" />
        <Input
          label="Número de Telefone"
          placeholder="Ex: 923 000 000"
          keyboardType="phone-pad"
        />
        <Input
          label="Valor Semanal (Kz)"
          placeholder="50.000"
          keyboardType="numeric"
        />
        <Input label="Data de Início" placeholder="DD/MM/AAAA" />

        <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1 mt-4">
          Veículo Atribuído
        </Text>
        <TouchableOpacity
          onPress={() => setShowVehiclePicker(true)}
          className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-row justify-between items-center mb-8"
        >
          <View className="flex-row items-center">
            {selectedVehicle ? (
              <>
                {selectedVehicle.type === "carro" ? (
                  <Car color="#3b82f6" size={20} className="mr-2" />
                ) : (
                  <Bike color="#6366f1" size={20} className="mr-2" />
                )}
                <Text className="text-slate-900 font-bold">
                  {selectedVehicle.plate}
                </Text>
              </>
            ) : (
              <Text className="text-slate-400">Selecionar da frota...</Text>
            )}
          </View>
          <ChevronRight color="#94a3b8" size={20} />
        </TouchableOpacity>

        <TouchableOpacity className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/30 mb-10">
          <Text className="text-white text-center font-bold text-lg">
            Registar Motorista
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Vehicle Picker Modal */}
      <Modal
        visible={showVehiclePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVehiclePicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[32px] p-6 h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-black text-slate-900">
                Selecionar Veículo
              </Text>
              <TouchableOpacity
                onPress={() => setShowVehiclePicker(false)}
                className="bg-slate-100 p-2 rounded-full"
              >
                <X color="#64748b" size={20} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={availableVehicles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedVehicle(item);
                    setShowVehiclePicker(false);
                  }}
                  className={`p-4 rounded-2xl mb-3 flex-row items-center justify-between border ${selectedVehicle?.id === item.id ? "border-blue-500 bg-blue-50" : "border-slate-100"}`}
                >
                  <View className="flex-row items-center">
                    <View className="bg-white p-2 rounded-xl mr-3 shadow-sm">
                      {item.type === "carro" ? (
                        <Car color="#3b82f6" size={20} />
                      ) : (
                        <Bike color="#6366f1" size={20} />
                      )}
                    </View>
                    <View>
                      <Text className="text-slate-900 font-bold">
                        {item.plate}
                      </Text>
                      <Text className="text-slate-400 text-xs">
                        {item.model}
                      </Text>
                    </View>
                  </View>
                  {selectedVehicle?.id === item.id && (
                    <Check color="#3b82f6" size={20} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View className="py-10 items-center">
                  <Car color="#CBD5E1" size={48} />
                  <Text className="text-slate-400 mt-2">
                    Nenhum veículo disponível.
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
        className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-900 font-semibold"
        placeholderTextColor="#94a3b8"
        {...props}
      />
    </View>
  );
}
