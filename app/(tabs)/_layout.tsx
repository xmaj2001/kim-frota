import React from "react";
import { Tabs } from "expo-router";
import {
  LayoutDashboard,
  Car,
  Users,
  ReceiptText,
  BarChart3,
} from "lucide-react-native";
import { useColorScheme } from "@/components/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",
          height: 85,
          paddingBottom: 30,
          paddingTop: 10,
          backgroundColor: "#FFFFFF",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerStyle: {
          backgroundColor: "#F8FAFC",
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Kim Frota",
          tabBarLabel: "Início",
          tabBarIcon: ({ color }) => (
            <LayoutDashboard color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: "Veículos",
          tabBarLabel: "Veículos",
          tabBarIcon: ({ color }) => <Car color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="drivers"
        options={{
          title: "Motoristas",
          tabBarLabel: "Motoristas",
          tabBarIcon: ({ color }) => <Users color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: "Pagamentos",
          tabBarLabel: "Pagamentos",
          tabBarIcon: ({ color }) => <ReceiptText color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Relatórios",
          tabBarLabel: "Relatórios",
          tabBarIcon: ({ color }) => <BarChart3 color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
