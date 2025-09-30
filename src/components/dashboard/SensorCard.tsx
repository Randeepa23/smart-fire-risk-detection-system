import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold: number;
  icon: LucideIcon;
  color: string;
  trend: "up" | "down" | "stable";
}

interface SensorCardProps {
  sensor: SensorData;
}

export function SensorCard({ sensor }: SensorCardProps) {
  const { name, value, unit, threshold, icon: Icon, color, trend } = sensor;
  
  const isOverThreshold = value > threshold;
  const percentage = Math.min((value / threshold) * 100, 100);

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return { icon: "↗", color: "text-red-400", bg: "bg-red-500/20" };
      case "down":
        return { icon: "↘", color: "text-blue-400", bg: "bg-blue-500/20" };
      case "stable":
        return { icon: "→", color: "text-emerald-400", bg: "bg-emerald-500/20" };
    }
  };

  const trendConfig = getTrendIcon();

  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:-translate-y-1 p-6 sensor-card group cursor-pointer">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
            <Icon 
              className="h-8 w-8 drop-shadow-[0_0_10px_currentColor] transition-all duration-300 group-hover:drop-shadow-[0_0_15px_currentColor]" 
              style={{ color }} 
            />
          </div>
          <h3 className="font-bold text-lg text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] group-hover:text-white/90 transition-all duration-300">{name}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full ${trendConfig.bg} border border-white/20`}>
          <span className={`text-lg font-bold ${trendConfig.color}`}>
            {trendConfig.icon}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Value Display */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-4xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">{value.toFixed(1)}</span>
            <span className="text-lg text-white/80 font-medium">{unit}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p className="text-sm text-white/70 font-medium">
              Threshold: <span className="text-white font-bold">{threshold} {unit}</span>
            </p>
          </div>
        </div>
        
        {/* Enhanced Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60 font-medium">
            <span>0</span>
            <span>{threshold}</span>
          </div>
          <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-3 border border-white/20 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-700 ${
                isOverThreshold 
                  ? "bg-gradient-to-r from-red-500 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.6)]" 
                  : "bg-gradient-to-r from-emerald-400 to-green-500 shadow-[0_0_10px_rgba(52,211,153,0.4)]"
              }`}
              style={{ 
                width: `${Math.min(percentage, 100)}%`,
              }}
            />
          </div>
        </div>
        
        {isOverThreshold && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-lg p-3">
            <p className="text-sm text-red-300 font-bold flex items-center gap-2">
              <span className="animate-pulse">⚠</span> Above threshold
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}