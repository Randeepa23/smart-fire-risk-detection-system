import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { SensorReading, Alert } from "@/hooks/useSensorData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Reports() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalReadings: 0,
    avgTemperature: 0,
    avgHumidity: 0,
    riskDetections: 0,
    alertsGenerated: 0,
  });

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch sensor readings
      const { data: readingsData, error: readingsError } = await supabase
        .from('sensor_readings')
        .select('*')
        .gte('timestamp', startOfDay(dateRange.from).toISOString())
        .lte('timestamp', endOfDay(dateRange.to).toISOString())
        .order('timestamp', { ascending: true });

      if (readingsError) throw readingsError;
      setReadings(readingsData as SensorReading[] || []);

      // Fetch alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .gte('created_at', startOfDay(dateRange.from).toISOString())
        .lte('created_at', endOfDay(dateRange.to).toISOString())
        .order('created_at', { ascending: true });

      if (alertsError) throw alertsError;
      setAlerts(alertsData as Alert[] || []);

      // Calculate statistics
      if (readingsData && readingsData.length > 0) {
        const avgTemp = readingsData.reduce((sum, r) => sum + (r.temperature || 0), 0) / readingsData.length;
        const avgHum = readingsData.reduce((sum, r) => sum + (r.humidity || 0), 0) / readingsData.length;
        const riskCount = readingsData.filter(r => r.fire_risk_prediction !== 'safe').length;

        setStats({
          totalReadings: readingsData.length,
          avgTemperature: avgTemp,
          avgHumidity: avgHum,
          riskDetections: riskCount,
          alertsGenerated: alertsData?.length || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const exportReport = () => {
    const reportData = {
      dateRange: `${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}`,
      statistics: stats,
      readings: readings.length,
      alerts: alerts.length,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fire-detection-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = readings.map(reading => ({
    time: format(new Date(reading.timestamp), 'MMM dd HH:mm'),
    temperature: reading.temperature,
    humidity: reading.humidity,
    co2: reading.co2_level,
    risk: reading.fire_risk_prediction === 'safe' ? 0 : reading.fire_risk_prediction === 'warning' ? 1 : 2,
  }));

  const riskDistribution = [
    { name: 'Safe', value: readings.filter(r => r.fire_risk_prediction === 'safe').length, color: '#22c55e' },
    { name: 'Warning', value: readings.filter(r => r.fire_risk_prediction === 'warning').length, color: '#f59e0b' },
    { name: 'Danger', value: readings.filter(r => r.fire_risk_prediction === 'danger').length, color: '#ef4444' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Fire Detection Reports</h1>
          <p className="text-muted-foreground">
            Analyze sensor data and system performance over time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={reportType} onValueChange={(value: "daily" | "weekly" | "monthly") => setReportType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Report Period</CardTitle>
          <CardDescription>Select the date range for your report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateRange.from, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="flex items-center">to</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateRange.to, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">Total Readings</div>
            </div>
            <div className="text-2xl font-bold">{stats.totalReadings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Avg Temperature</div>
            </div>
            <div className="text-2xl font-bold">{stats.avgTemperature.toFixed(1)}°C</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-500" />
              <div className="text-sm font-medium">Avg Humidity</div>
            </div>
            <div className="text-2xl font-bold">{stats.avgHumidity.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Risk Detections</div>
            </div>
            <div className="text-2xl font-bold">{stats.riskDetections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div className="text-sm font-medium">Alerts Generated</div>
            </div>
            <div className="text-2xl font-bold">{stats.alertsGenerated}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sensor Trends</CardTitle>
            <CardDescription>Temperature and humidity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature (°C)" />
                <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Fire risk levels detected</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Alerts generated during the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No alerts in the selected period</p>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 10).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.severity}
                    </Badge>
                    <div>
                      <p className="font-medium">{alert.alert_type}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(alert.created_at), 'PPp')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}