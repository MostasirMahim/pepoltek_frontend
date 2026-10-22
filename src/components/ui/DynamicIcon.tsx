import React from "react";
import {
  Zap,
  Cpu,
  Globe,
  Users,
  Stethoscope,
  Award,
  ShieldCheck,
  BarChart2,
  Database,
  Layers,
} from "@/components/ui/Icons";

export function renderDynamicIcon(name?: string, size = 20) {
  switch (name) {
    case "Zap":
      return <Zap size={size} />;
    case "Cpu":
      return <Cpu size={size} />;
    case "Globe":
      return <Globe size={size} />;
    case "Users":
      return <Users size={size} />;
    case "Stethoscope":
      return <Stethoscope size={size} />;
    case "Award":
      return <Award size={size} />;
    case "ShieldCheck":
      return <ShieldCheck size={size} />;
    case "BarChart2":
      return <BarChart2 size={size} />;
    case "Database":
      return <Database size={size} />;
    case "Layers":
    default:
      return <Layers size={size} />;
  }
}
