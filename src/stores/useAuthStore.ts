import { create } from "zustand";
import { AuthUser, logoutAction } from "@/actions/auth.actions";

interface AuthState {
  user: AuthUser | null;
  activePersona: "alex" | "rachel";
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setActivePersona: (persona: "alex" | "rachel") => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  activePersona: "alex",
  isLoading: false,
  setUser: (user) => set({ user }),
  setActivePersona: (persona) => set({ activePersona: persona }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    await logoutAction();
    set({ user: null });
  },
}));
