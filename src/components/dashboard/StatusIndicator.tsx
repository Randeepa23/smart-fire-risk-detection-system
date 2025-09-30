import { Shield, AlertTriangle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export type RiskLevel = "safe" | "warning" | "danger";

interface StatusIndicatorProps {
  riskLevel: RiskLevel;
  lastUpdate: Date;
}

export function StatusIndicator({ riskLevel, lastUpdate }: StatusIndicatorProps) {
  const getStatusConfig = (level: RiskLevel) => {
    switch (level) {
      case "safe":
        return {
          icon: Shield,
          label: "SAFE",
          message: "No fire risk detected",
          className: "status-safe",
          bgColor: "bg-emerald-500/20",
          borderColor: "border-emerald-400/50",
          textColor: "text-emerald-300",
          iconColor: "text-emerald-400",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          label: "WARNING",
          message: "Elevated fire risk detected",
          className: "status-warning",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-400/50",
          textColor: "text-yellow-300",
          iconColor: "text-yellow-400",
        };
      case "danger":
        return {
          icon: AlertCircle,
          label: "DANGER",
          message: "High fire risk detected",
          className: "status-danger",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-400/50",
          textColor: "text-red-300",
          iconColor: "text-red-400",
        };
    }
  };

  const config = getStatusConfig(riskLevel);
  const Icon = config.icon;

  return (
    <Card className={`p-8 border-2 ${config.bgColor} ${config.borderColor} backdrop-blur-md shadow-2xl hover:shadow-3xl hover:border-opacity-70 transition-all duration-500 ease-in-out transform hover:scale-[1.01] group cursor-pointer`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-xl font-bold text-2xl ${config.className} bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-300`}>
          <div className={`p-3 rounded-full ${config.bgColor} border ${config.borderColor} group-hover:scale-110 transition-all duration-300`}>
            <Icon className={`h-8 w-8 ${config.iconColor} drop-shadow-[0_0_10px_currentColor] group-hover:drop-shadow-[0_0_15px_currentColor] transition-all duration-300`} />
          </div>
          <span className={`${config.textColor} drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-all duration-300`}>{config.label}</span>
        </div>
        <div className="text-right">
          <div className="w-4 h-4 rounded-full animate-pulse bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-white font-semibold text-xl drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">{config.message}</p>
        <div className="flex items-center justify-between text-white/80">
          <span className="text-sm font-medium">Last updated:</span>
          <span className="text-sm font-mono bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </Card>
  );
}