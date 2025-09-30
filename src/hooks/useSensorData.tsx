import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SensorReading {
  id: string;
  node_id: string;
  temperature: number;
  humidity: number;
  co2_level: number;
  co_level: number;
  h2_level: number;
  fire_risk_prediction: 'safe' | 'warning' | 'danger';
  confidence_score: number;
  timestamp: string;
  sensor_nodes?: {
    name: string;
    location: string;
  };
}

export interface SensorNode {
  id: string;
  name: string;
  location: string;
  status: string;
}

export interface Alert {
  id: string;
  node_id: string;
  alert_type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
  created_at: string;
  sensor_nodes?: {
    name: string;
    location: string;
  };
}

interface SensorDataContextType {
  latestReading: SensorReading | null;
  recentReadings: SensorReading[];
  alerts: Alert[];
  nodes: SensorNode[];
  loading: boolean;
  refreshData: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
}

const SensorDataContext = createContext<SensorDataContextType | undefined>(undefined);

export const useSensorData = () => {
  const context = useContext(SensorDataContext);
  if (context === undefined) {
    throw new Error('useSensorData must be used within a SensorDataProvider');
  }
  return context;
};

interface SensorDataProviderProps {
  children: ReactNode;
}

export const SensorDataProvider = ({ children }: SensorDataProviderProps) => {
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  const [recentReadings, setRecentReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [nodes, setNodes] = useState<SensorNode[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLatestReading = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select(`
          *,
          sensor_nodes (
            name,
            location
          )
        `)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      setLatestReading(data?.[0] as SensorReading || null);
    } catch (error) {
      console.error('Error fetching latest reading:', error);
    }
  };

  const fetchRecentReadings = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select(`
          *,
          sensor_nodes (
            name,
            location
          )
        `)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      setRecentReadings(data as SensorReading[] || []);
    } catch (error) {
      console.error('Error fetching recent readings:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          sensor_nodes (
            name,
            location
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      setAlerts(data as Alert[] || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchNodes = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_nodes')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setNodes(data || []);
    } catch (error) {
      console.error('Error fetching sensor nodes:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchLatestReading(),
      fetchRecentReadings(),
      fetchAlerts(),
      fetchNodes()
    ]);
    setLoading(false);
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({
          acknowledged: true,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true }
            : alert
        )
      );

      toast({
        title: "Alert Acknowledged",
        description: "The alert has been marked as acknowledged.",
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge alert.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    refreshData();

    // Set up real-time subscription for new readings
    const readingsChannel = supabase
      .channel('sensor-readings-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings'
        },
        () => {
          fetchLatestReading();
          fetchRecentReadings();
        }
      )
      .subscribe();

    // Set up real-time subscription for new alerts
    const alertsChannel = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts'
        },
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(readingsChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, []);

  const value = {
    latestReading,
    recentReadings,
    alerts,
    nodes,
    loading,
    refreshData,
    acknowledgeAlert,
  };

  return (
    <SensorDataContext.Provider value={value}>
      {children}
    </SensorDataContext.Provider>
  );
};