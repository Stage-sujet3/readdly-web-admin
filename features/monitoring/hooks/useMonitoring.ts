"use client"

import { useState, useEffect, useCallback } from "react";
import { getMonitoringSummary } from "@/services/user.service";

export interface ServiceHealth {
  id: string;
  serviceName: string;
  status: 'HEALTHY' | 'WARNING' | 'DOWN';
  uptime: number;
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
  lastCheck: string;
}

export interface SmartInsight {
  type: 'PERFORMANCE' | 'STABILITY' | 'USAGE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
}

export interface SmartAlert {
  id: string;
  service: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  timestamp: string;
}

export function useMonitoring() {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [healthScore, setHealthScore] = useState<number>(0);
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await getMonitoringSummary();

      if (response.data?.success) {
        const data = response.data.data ?? {};
        setServices(data.services || []);
        setHealthScore(data.healthScore ?? 0);
        setInsights(data.insights || []);
        setUsage(data.usage ?? null);
        setAlerts(data.alerts || []);
        setError(null);
      } else {
        // Non-fatal: log the message but keep last known state
        const msg = response.data?.message || "Monitoring data unavailable";
        console.warn("[useMonitoring] Backend responded with failure:", msg);
        setError(msg);
      }
    } catch (err: any) {
      const msg = err?.message || "Connection error to monitoring service";
      console.warn("[useMonitoring] Fetch error:", msg);
      // Only set error if we have no data at all, so the UI still shows last known state
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    services,
    healthScore,
    insights,
    usage,
    alerts,
    isLoading,
    error,
    refresh: fetchData,
  };
}
