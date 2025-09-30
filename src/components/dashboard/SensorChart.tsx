import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  co2: number;
  co: number;
  hydrogen: number;
}

interface SensorChartProps {
  data: ChartDataPoint[];
  selectedSensors?: string[];
}

export function SensorChart({ data, selectedSensors = ["temperature", "humidity", "co2"] }: SensorChartProps) {
  const sensorConfig = {
    temperature: { color: "hsl(var(--temperature))", name: "Temperature (°C)" },
    humidity: { color: "hsl(var(--humidity))", name: "Humidity (%)" },
    co2: { color: "hsl(var(--co2))", name: "CO₂ (ppm)" },
    co: { color: "hsl(var(--co))", name: "CO (ppm)" },
    hydrogen: { color: "hsl(var(--hydrogen))", name: "H₂ (ppm)" },
  };

  return (
    <Card className="col-span-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
          <div className="p-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30">
            📊
          </div>
          Sensor Data Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth={1}
                />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.8)"
                  fontSize={12}
                  fontWeight="500"
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.8)"
                  fontSize={12}
                  fontWeight="500"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)"
                  }}
                  labelStyle={{ color: "white", fontWeight: "bold" }}
                />
                <Legend 
                  wrapperStyle={{ 
                    color: "white", 
                    fontSize: "14px", 
                    fontWeight: "500",
                    paddingTop: "20px"
                  }}
                />
                
                {selectedSensors.map((sensor) => (
                  <Line
                    key={sensor}
                    type="monotone"
                    dataKey={sensor}
                    stroke={sensorConfig[sensor as keyof typeof sensorConfig].color}
                    strokeWidth={3}
                    dot={{ 
                      fill: sensorConfig[sensor as keyof typeof sensorConfig].color, 
                      strokeWidth: 2, 
                      r: 5,
                      filter: "drop-shadow(0 0 6px currentColor)"
                    }}
                    name={sensorConfig[sensor as keyof typeof sensorConfig].name}
                    activeDot={{ 
                      r: 8, 
                      stroke: sensorConfig[sensor as keyof typeof sensorConfig].color,
                      strokeWidth: 2,
                      fill: "white"
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}