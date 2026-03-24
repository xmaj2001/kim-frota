import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LucideIcon, SearchX, Loader2 } from "lucide-react-native";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export const EmptyState = ({
  title,
  description,
  icon: Icon = SearchX,
}: EmptyStateProps) => (
  <View className="flex-1 items-center justify-center p-8 opacity-60">
    <View className="bg-slate-100 p-6 rounded-full mb-4">
      <Icon color="#64748B" size={48} />
    </View>
    <Text className="text-xl font-bold text-slate-800 text-center">
      {title}
    </Text>
    <Text className="text-slate-500 text-center mt-2">{description}</Text>
  </View>
);

export const LoadingState = () => (
  <View className="flex-1 items-center justify-center bg-background">
    <View className="bg-white p-8 rounded-3xl shadow-xl border border-slate-50 items-center">
      <Loader2 className="animate-spin" color="#3B82F6" size={40} />
      <Text className="mt-4 font-bold text-slate-700">
        Loading Fleet Data...
      </Text>
      <Text className="text-slate-400 text-xs mt-1">Please wait a moment</Text>
    </View>
  </View>
);

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm ${className}`}
  >
    {children}
  </View>
);

export const Badge = ({
  label,
  color = "primary",
}: {
  label: string;
  color?: "primary" | "success" | "danger" | "warning";
}) => {
  const colors = {
    primary: "bg-blue-100 text-blue-700",
    success: "bg-emerald-100 text-emerald-700",
    danger: "bg-red-100 text-red-700",
    warning: "bg-amber-100 text-amber-700",
  };

  return (
    <View className={`px-2 py-0.5 rounded-full ${colors[color]}`}>
      <Text className={`text-[10px] font-bold uppercase`}>{label}</Text>
    </View>
  );
};
