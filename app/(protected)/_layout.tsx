import { useAuth } from "@/context/authcontext";
import { Redirect, Slot } from "expo-router";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Redirect href="../app/auth/login" />;

  return <Slot />;
}
