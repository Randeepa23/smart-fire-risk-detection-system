import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SensorData } from "./SensorCard";
import { RiskLevel } from "./StatusIndicator";
import { Thermometer, Droplets, Cloud, Zap, Flame } from "lucide-react";

interface DashboardData {
  riskLevel: RiskLevel;
  sensors: SensorData[];
  chartData: Array<{
    time: string;
    temperature: number;
    humidity: number;
    co2: number;
    co: number;
    hydrogen: number;
  }>;
  lastUpdate: Date;
}

const DashboardContext = createContext<DashboardData | null>(null);

export function useDashboardData() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardData must be used within a MockDataProvider");
  }
  return context;
}

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData>({
    riskLevel: "safe",
    sensors: [],
    chartData: [],
    lastUpdate: new Date(),
  });

  // Generate realistic sensor data
  const generateSensorData = (): SensorData[] => {
    const baseTemp = 22 + Math.random() * 8; // 22-30°C
    const baseHumidity = 45 + Math.random() * 20; // 45-65%
    const baseCO2 = 400 + Math.random() * 200; // 400-600 ppm
    const baseCO = Math.random() * 10; // 0-10 ppm
    const baseH2 = Math.random() * 5; // 0-5 ppm

    return [
      {
        id: "temperature",
        name: "Temperature",
        value: baseTemp,
        unit: "°C",
        threshold: 35,
        icon: Thermometer,
        color: "hsl(var(--temperature))",
        trend: Math.random() > 0.5 ? "up" : "down",
      },
      {
        id: "humidity",
        name: "Humidity",
        value: baseHumidity,
        unit: "%",
        threshold: 70,
        icon: Droplets,
        color: "hsl(var(--humidity))",
        trend: Math.random() > 0.5 ? "stable" : "down",
      },
      {
        id: "co2",
        name: "Carbon Dioxide",
        value: baseCO2,
        unit: "ppm",
        threshold: 1000,
        icon: Cloud,
        color: "hsl(var(--co2))",
        trend: "up",
      },
      {
        id: "co",
        name: "Carbon Monoxide",
        value: baseCO,
        unit: "ppm",
        threshold: 50,
        icon: Zap,
        color: "hsl(var(--co))",
        trend: "stable",
      },
      {
        id: "hydrogen",
        name: "Hydrogen",
        value: baseH2,
        unit: "ppm",
        threshold: 40,
        icon: Flame,
        color: "hsl(var(--hydrogen))",
        trend: Math.random() > 0.7 ? "up" : "stable",
      },
    ];
  };

  // Calculate risk level based on sensor data
  const calculateRiskLevel = (sensors: SensorData[]): RiskLevel => {
    const overThresholdCount = sensors.filter(s => s.value > s.threshold).length;
    const tempSensor = sensors.find(s => s.id === "temperature");
    const coSensor = sensors.find(s => s.id === "co");
    
    if (overThresholdCount >= 2 || (tempSensor && tempSensor.value > 40) || (coSensor && coSensor.value > 25)) {
      return "danger";
    } else if (overThresholdCount >= 1 || (tempSensor && tempSensor.value > 30)) {
      return "warning";
    }
    return "safe";
  };

  // Generate chart data for the last 24 hours
  const generateChartData = () => {
    const points = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      points.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: 20 + Math.random() * 15 + Math.sin(i * 0.5) * 3,
        humidity: 40 + Math.random() * 30 + Math.cos(i * 0.3) * 10,
        co2: 350 + Math.random() * 300 + Math.sin(i * 0.2) * 50,
        co: Math.random() * 15 + Math.sin(i * 0.4) * 5,
        hydrogen: Math.random() * 8 + Math.cos(i * 0.6) * 2,
      });
    }
    
    return points;
  };

  useEffect(() => {
    const updateData = () => {
      const sensors = generateSensorData();
      const riskLevel = calculateRiskLevel(sensors);
      
      setData({
        riskLevel,
        sensors,
        chartData: generateChartData(),
        lastUpdate: new Date(),
      });
    };

    // Initial data
    updateData();

    // Update every 3 seconds to simulate real-time data
    const interval = setInterval(updateData, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardContext.Provider value={data}>
      {children}
    </DashboardContext.Provider>
  );
}