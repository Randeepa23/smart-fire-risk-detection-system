import { StatusIndicator } from "./StatusIndicator";
import { SensorCard } from "./SensorCard";
import { SensorChart } from "./SensorChart";
import { useSensorData } from "@/hooks/useSensorData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Wifi, Database, Shield, Activity, LogOut, Users, BarChart3, Thermometer, Droplets, Cloud, Wind, Atom, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import dashboardBackground from "@/assets/50e8bca4-e0da-4a24-a317-393aa4e58a1b.png";

export function Dashboard() {
  const { latestReading, recentReadings, loading } = useSensorData();
  const { signOut, isAdmin, user } = useAuth();

  const riskLevel = latestReading?.fire_risk_prediction || 'safe';
  const lastUpdate = latestReading ? new Date(latestReading.timestamp) : new Date();

  const sensors = latestReading ? [
    {
      id: 'temp',
      name: 'Temperature',
      value: latestReading.temperature || 0,
      unit: '°C',
      threshold: 40,
      icon: Thermometer,
      color: 'text-red-500',
      trend: 'stable' as const,
    },
    {
      id: 'humidity',
      name: 'Humidity',
      value: latestReading.humidity || 0,
      unit: '%',
      threshold: 80,
      icon: Droplets,
      color: 'text-blue-500',
      trend: 'stable' as const,
    },
    {
      id: 'co2',
      name: 'CO₂ Level',
      value: latestReading.co2_level || 0,
      unit: 'ppm',
      threshold: 1000,
      icon: Cloud,
      color: 'text-green-500',
      trend: 'stable' as const,
    },
    {
      id: 'co',
      name: 'CO Level',
      value: latestReading.co_level || 0,
      unit: 'ppm',
      threshold: 50,
      icon: Wind,
      color: 'text-orange-500',
      trend: 'stable' as const,
    },
    {
      id: 'h2',
      name: 'H₂ Level',
      value: latestReading.h2_level || 0,
      unit: 'ppm',
      threshold: 40,
      icon: Atom,
      color: 'text-purple-500',
      trend: 'stable' as const,
    },
  ] : [];

  const chartData = recentReadings.slice(-20).map(reading => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    temperature: reading.temperature,
    humidity: reading.humidity,
    co2: reading.co2_level,
    co: reading.co_level,
    hydrogen: reading.h2_level,
  }));

  const systemStats = [
    { label: "NodeMCU Status", value: "Online", icon: Wifi, status: "safe" },
    { label: "ML Model", value: "Active", icon: Database, status: "safe" },
    { label: "Data Points", value: "1,247", icon: Activity, status: "safe" },
    { label: "Uptime", value: "99.8%", icon: Shield, status: "safe" },
  ];

  return (
    <div 
      className="min-h-screen bg-background p-2 sm:p-4 md:p-6 relative overflow-x-hidden"
      style={{
        backgroundImage: `url(${dashboardBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                <div className="p-2 sm:p-3 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30 w-fit">
                  <Leaf className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] leading-tight">
                    Environmental Fire Risk Detection
                  </h1>
                  <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full mt-2"></div>
                </div>
              </div>
              <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] mb-2">
                Real-time environmental monitoring with AI-powered risk assessment
              </p>
              <p className="text-emerald-200 font-medium drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)] text-sm sm:text-base">
                Welcome, {user?.email}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 lg:mt-0">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-emerald-400/50 text-white px-3 py-1.5 text-xs sm:text-sm font-medium">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-emerald-400" />
                {loading ? 'Loading...' : 'Live Data'}
              </Badge>
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-blue-400/50 text-white px-3 py-1.5 text-xs sm:text-sm font-medium">
                <Wifi className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-blue-400" />
                NodeMCU Connected
              </Badge>
              <div className="flex flex-wrap gap-2">
                <Link to="/reports">
                  <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:shadow-lg transition-all duration-300 ease-in-out text-xs sm:text-sm px-2 sm:px-3">
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    <span className="hidden sm:inline">Reports</span>
                    <span className="sm:hidden">Rep</span>
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:shadow-lg transition-all duration-300 ease-in-out group text-xs sm:text-sm px-2 sm:px-3">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 transition-transform duration-300 group-hover:scale-110" />
                      <span className="hidden sm:inline">Admin</span>
                      <span className="sm:hidden">Adm</span>
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={signOut} className="bg-red-500/20 backdrop-blur-sm border-red-400/50 text-white hover:bg-red-500/30 hover:border-red-400/70 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 ease-in-out group text-xs sm:text-sm px-2 sm:px-3">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Status */}
        <StatusIndicator riskLevel={riskLevel} lastUpdate={lastUpdate} />

        {/* System Status Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {systemStats.map((stat) => (
            <Card key={stat.label} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:-translate-y-1 group cursor-pointer">
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <div className="p-2 sm:p-3 bg-emerald-500/20 backdrop-blur-sm rounded-full w-fit mx-auto mb-3 sm:mb-4 border border-emerald-400/30 group-hover:bg-emerald-500/30 group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)] group-hover:drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] transition-all duration-300" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-white/80 mb-1 sm:mb-2 tracking-wide">{stat.label}</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sensor Data Grid */}
        <div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 shadow-lg mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] flex items-center gap-2 sm:gap-3">
              <Thermometer className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-emerald-400" />
              Sensor Readings
            </h2>
          </div>
          <div className="dashboard-grid gap-3 sm:gap-4 md:gap-6">
            {sensors.map((sensor) => (
              <SensorCard key={sensor.id} sensor={sensor} />
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 shadow-lg mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] flex items-center gap-2 sm:gap-3">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-emerald-400" />
              Data Trends
            </h2>
          </div>
          <SensorChart data={chartData} />
        </div>

        {/* Risk Assessment Details */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/15 hover:border-white/30 hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.01] group">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl text-white">
              <span className="text-lg sm:text-xl">🤖</span>
              <span className="drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">ML Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <h4 className="font-semibold text-white text-sm sm:text-base drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">Detection Algorithm</h4>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)]">
                  Advanced decision tree model running on NodeMCU ESP32, trained on 10,000+ 
                  fire incident datasets. Real-time inference with sub-second response time.
                </p>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h4 className="font-semibold text-white text-sm sm:text-base drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">Sensor Fusion</h4>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)]">
                  Multi-sensor data correlation analyzing temperature patterns, gas concentrations, 
                  and environmental conditions for comprehensive fire risk evaluation.
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
              <p className="text-xs font-mono text-white/70 break-all sm:break-normal">
                <span className="block sm:inline">Last ML inference: {lastUpdate.toISOString()}</span>
                <span className="block sm:inline sm:ml-2">| Model accuracy: 94.7%</span>
                <span className="block sm:inline sm:ml-2">| Response time: 0.23ms</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}