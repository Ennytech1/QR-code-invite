import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to connect to the QRInvite RFC 6455 Native WebSocket Gateway
 * for instantaneous gate telemetry and scan events.
 */
export const useGateWebSocket = (eventId, options = {}) => {
  const { onScanEvent, onTelemetryUpdate, autoReconnect = true } = options;

  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting' | 'connected' | 'reconnecting' | 'offline'
  const [liveSocketLogs, setLiveSocketLogs] = useState([]);
  const [socketVelocity, setSocketVelocity] = useState(null);
  const [latencyMs, setLatencyMs] = useState(null);
  const [activeSubscribers, setActiveSubscribers] = useState(0);

  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const pingTimestampRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const activeEventIdRef = useRef(eventId);

  activeEventIdRef.current = eventId;

  const getWsUrl = useCallback(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      const url = new URL(apiUrl);
      const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${url.host}/ws`;
    } catch (e) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.hostname}:5000/ws`;
    }
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsUrl = getWsUrl();
    try {
      setConnectionStatus(reconnectAttemptsRef.current > 0 ? 'reconnecting' : 'connecting');
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;

        // Subscribe to current event if provided
        if (activeEventIdRef.current) {
          ws.send(JSON.stringify({
            type: 'SUBSCRIBE',
            eventId: String(activeEventIdRef.current),
          }));
        }

        // Setup periodic latency ping every 20 seconds
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            pingTimestampRef.current = Date.now();
            ws.send(JSON.stringify({ type: 'PING' }));
          }
        }, 20000);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'CONNECTED') {
            // Initial connection acknowledgment
          } else if (message.type === 'PONG') {
            if (pingTimestampRef.current) {
              setLatencyMs(Date.now() - pingTimestampRef.current);
            }
          } else if (message.type === 'SUBSCRIBED') {
            // Subscribed to event telemetry
          } else if (message.type === 'SCAN_EVENT') {
            const scanData = message.data || {};
            const formattedLog = {
              id: `ws_live_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              timestamp: scanData.timestamp || message.timestamp || new Date().toISOString(),
              guestName: scanData.guestName || 'Live Attendee',
              guestId: scanData.guestId || 'gst_ws_01',
              tier: scanData.tier || 'REGULAR',
              table: scanData.table || 'General Admission',
              gate: scanData.gate || 'Turnstile Gate #1',
              scannerId: scanData.scannerId || 'TRM-WS-01',
              outcome: scanData.outcome || 'SUCCESS',
              message: scanData.message,
              latencyMs: scanData.latencyMs || Math.floor(18 + Math.random() * 20),
              isWebSocketEvent: true,
            };

            setLiveSocketLogs((prev) => [formattedLog, ...prev.slice(0, 49)]);

            if (onScanEvent) {
              onScanEvent(formattedLog);
            }
          } else if (message.type === 'TELEMETRY_UPDATE') {
            if (message.data?.velocity !== undefined) {
              setSocketVelocity(message.data.velocity);
            }
            if (onTelemetryUpdate) {
              onTelemetryUpdate(message.data);
            }
          }
        } catch (err) {
          console.warn('[WS] Failed to parse message frame:', err);
        }
      };

      ws.onclose = () => {
        setConnectionStatus('offline');
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

        if (autoReconnect) {
          const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 10000);
          reconnectAttemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      ws.onerror = (err) => {
        console.warn('[WS] Gateway connection warning (running with fallback):', err.message || err);
        ws.close();
      };
    } catch (err) {
      setConnectionStatus('offline');
    }
  }, [getWsUrl, autoReconnect, onScanEvent, onTelemetryUpdate]);

  // Re-subscribe when target event changes
  useEffect(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && eventId) {
      socketRef.current.send(JSON.stringify({
        type: 'SUBSCRIBE',
        eventId: String(eventId),
      }));
    }
  }, [eventId]);

  // Initial connection on mount
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  // Manual ping/test broadcast sender
  const sendTestScan = useCallback((mockData = {}) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        type: 'SCAN_EVENT',
        eventId: String(eventId || 'evt_general'),
        timestamp: new Date().toISOString(),
        data: {
          outcome: mockData.outcome || 'SUCCESS',
          guestName: mockData.name || 'Live VIP Guest (WebSocket Test)',
          tier: mockData.tier || 'VVIP',
          table: mockData.table || 'Table 1 • Presidential',
          gate: mockData.gate || 'VIP Gate East',
          scannerId: 'TRM-SIM-01',
          latencyMs: 19,
          ...mockData,
        },
      };
      socketRef.current.send(JSON.stringify(payload));
    }
  }, [eventId]);

  return {
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    liveSocketLogs,
    socketVelocity,
    latencyMs,
    sendTestScan,
    reconnect: connect,
  };
};

export default useGateWebSocket;

