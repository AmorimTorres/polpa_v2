import React, { useState } from "react";
import { LoginPage } from "@/pages/LoginPage";
import { MapPage } from "@/pages/MapPage";
import { getCurrentUser } from "@/store/authStore";
import { AuthUser } from "@/types";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return <MapPage currentUser={user.username} onLogout={() => setUser(null)} />;
}
