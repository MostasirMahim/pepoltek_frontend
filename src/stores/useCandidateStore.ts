import { create } from "zustand";
import { ReverseSearchMatchItem } from "@/actions/matching.actions";

interface CandidateState {
  matches: ReverseSearchMatchItem[];
  applications: any[];
  isLoading: boolean;
  setMatches: (matches: ReverseSearchMatchItem[]) => void;
  setApplications: (applications: any[]) => void;
  setLoading: (isLoading: boolean) => void;
  optimisticAuthorizePitch: (matchId: string, status: "authorized" | "declined") => void;
}

export const useCandidateStore = create<CandidateState>((set) => ({
  matches: [],
  applications: [],
  isLoading: false,
  setMatches: (matches) => set({ matches }),
  setApplications: (applications) => set({ applications }),
  setLoading: (isLoading) => set({ isLoading }),
  optimisticAuthorizePitch: (matchId, status) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, pitch_status: status } : m
      ),
    })),
}));
