const crypto = require('crypto');

/**
 * Native RFC 6455 WebSocket Server for Node.js
 * Zero-dependency, institutional-grade real-time gateway for QRInvite Gate Telemetry.
 */

// Connected clients: Set of Client objects
const clients = new Set();

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

/**
 * Encode a UTF-8 text message into an RFC 6455 unmasked frame (Server -> Client)
 */
function encodeFrame(message) {
  const payload = Buffer.from(typeof message === 'string' ? message : JSON.stringify(message), 'utf8');
  const length = payload.length;

  let header;
  if (length <= 125) {
    header = Buffer.alloc(2);
    header[0] = 0x81; // FIN + Opcode 1 (text)
    header[1] = length;
  } else if (length <= 65535) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(length), 2);
  }

  return Buffer.concat([header, payload]);
}

/**
 * Encode a Pong frame (Opcode 0x0A)
 */
function encodePong(payload = Buffer.alloc(0)) {
  const header = Buffer.alloc(2);
  header[0] = 0x8a; // FIN + Opcode 10 (Pong)
  header[1] = payload.length;
  return Buffer.concat([header, payload]);
}

/**
 * Decode an incoming client-masked RFC 6455 frame (Client -> Server)
 */
function decodeFrame(buffer) {
  if (buffer.length < 2) return null;

  const firstByte = buffer[0];
  const opcode = firstByte & 0x0f;
  const secondByte = buffer[1];
  const isMasked = (secondByte & 0x80) !== 0;
  let payloadLength = secondByte & 0x7f;

  let offset = 2;
  if (payloadLength === 126) {
    if (buffer.length < 4) return null;
    payloadLength = buffer.readUInt16BE(2);
    offset = 4;
  } else if (payloadLength === 127) {
    if (buffer.length < 10) return null;
    payloadLength = Number(buffer.readBigUInt64BE(2));
    offset = 10;
  }

  let maskingKey = null;
  if (isMasked) {
    if (buffer.length < offset + 4) return null;
    maskingKey = buffer.slice(offset, offset + 4);
    offset += 4;
  }

  if (buffer.length < offset + payloadLength) return null;

  const rawPayload = buffer.slice(offset, offset + payloadLength);
  const unmasked = Buffer.alloc(payloadLength);

  if (isMasked && maskingKey) {
    for (let i = 0; i < payloadLength; i++) {
      unmasked[i] = rawPayload[i] ^ maskingKey[i % 4];
    }
  } else {
    rawPayload.copy(unmasked);
  }

  return {
    opcode,
    payload: unmasked,
    totalFrameBytes: offset + payloadLength,
  };
}

class WebSocketClient {
  constructor(socket, req) {
    this.socket = socket;
    this.id = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.subscriptions = new Set();
    this.buffer = Buffer.alloc(0);
    this.isAlive = true;

    this.socket.on('data', (chunk) => this.handleData(chunk));
    this.socket.on('close', () => this.cleanup());
    this.socket.on('error', (err) => {
      console.warn(`[WS:${this.id}] Error:`, err.message);
      this.cleanup();
    });

    // Send immediate connection ACK
    this.send({
      type: 'CONNECTED',
      clientId: this.id,
      timestamp: new Date().toISOString(),
      message: 'QRInvite Real-Time Gateway Connected',
    });
  }

  send(data) {
    if (this.socket.destroyed || !this.socket.writable) return;
    try {
      const frame = encodeFrame(data);
      this.socket.write(frame);
    } catch (err) {
      console.error(`[WS:${this.id}] Send error:`, err);
    }
  }

  handleData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    while (this.buffer.length >= 2) {
      const frame = decodeFrame(this.buffer);
      if (!frame) break;

      this.buffer = this.buffer.slice(frame.totalFrameBytes);

      // Handle Opcode
      if (frame.opcode === 0x08) {
        // Connection Close
        this.cleanup();
        break;
      } else if (frame.opcode === 0x09) {
        // Ping -> respond with Pong
        if (this.socket.writable) {
          this.socket.write(encodePong(frame.payload));
        }
      } else if (frame.opcode === 0x0a) {
        // Pong
        this.isAlive = true;
      } else if (frame.opcode === 0x01) {
        // Text payload
        try {
          const text = frame.payload.toString('utf8');
          const message = JSON.parse(text);
          this.handleMessage(message);
        } catch (err) {
          console.warn(`[WS:${this.id}] Invalid JSON payload:`, err.message);
        }
      }
    }
  }

  handleMessage(msg) {
    if (!msg || typeof msg !== 'object') return;

    if (msg.type === 'SUBSCRIBE' && msg.eventId) {
      this.subscriptions.add(String(msg.eventId));
      this.send({
        type: 'SUBSCRIBED',
        eventId: String(msg.eventId),
        timestamp: new Date().toISOString(),
      });
      console.log(`[WS:${this.id}] Subscribed to event: ${msg.eventId}`);
    } else if (msg.type === 'UNSUBSCRIBE' && msg.eventId) {
      this.subscriptions.delete(String(msg.eventId));
      this.send({
        type: 'UNSUBSCRIBED',
        eventId: String(msg.eventId),
      });
    } else if (msg.type === 'PING') {
      this.send({ type: 'PONG', timestamp: Date.now() });
    }
  }

  cleanup() {
    clients.delete(this);
    try {
      if (!this.socket.destroyed) {
        this.socket.destroy();
      }
    } catch (e) {}
  }
}

/**
 * Initialize WebSocket Gateway attached to Node HTTP server
 */
function initWebSocketServer(server) {
  server.on('upgrade', (req, socket, head) => {
    const pathname = (req.url || '').split('?')[0];

    // Only handle /ws or /api/ws
    if (pathname !== '/ws' && pathname !== '/api/ws') {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      socket.destroy();
      return;
    }

    const upgradeHeader = (req.headers['upgrade'] || '').toLowerCase();
    const key = req.headers['sec-websocket-key'];

    if (upgradeHeader !== 'websocket' || !key) {
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
      socket.destroy();
      return;
    }

    const acceptKey = crypto
      .createHash('sha1')
      .update(key + WS_GUID)
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${acceptKey}`,
      '\r\n',
    ];

    socket.write(headers.join('\r\n'));

    const client = new WebSocketClient(socket, req);
    clients.add(client);
    console.log(`[WS] Client connected. Total active clients: ${clients.size}`);
  });

  // Heartbeat ping interval every 30 seconds
  const interval = setInterval(() => {
    for (const client of clients) {
      if (!client.isAlive) {
        client.cleanup();
      } else {
        client.isAlive = false;
        try {
          if (client.socket.writable) {
            const pingFrame = Buffer.alloc(2);
            pingFrame[0] = 0x89; // FIN + Opcode 9 (Ping)
            pingFrame[1] = 0;
            client.socket.write(pingFrame);
          }
        } catch (e) {
          client.cleanup();
        }
      }
    }
  }, 30000);

  server.on('close', () => clearInterval(interval));

  return {
    clients,
    broadcast,
    broadcastToEvent,
    broadcastScanEvent,
    broadcastTelemetry,
  };
}

/**
 * Broadcast message to all connected clients
 */
function broadcast(message) {
  for (const client of clients) {
    client.send(message);
  }
}

/**
 * Broadcast message to clients subscribed to a specific event
 */
function broadcastToEvent(eventId, message) {
  const targetId = String(eventId);
  let count = 0;
  for (const client of clients) {
    // If client is subscribed to event OR has no specific subscriptions (global monitor)
    if (client.subscriptions.has(targetId) || client.subscriptions.size === 0) {
      client.send(message);
      count++;
    }
  }
  return count;
}

/**
 * Broadcast instant optical scan outcome
 */
function broadcastScanEvent(eventId, scanData) {
  return broadcastToEvent(eventId, {
    type: 'SCAN_EVENT',
    eventId: String(eventId),
    timestamp: new Date().toISOString(),
    data: scanData,
  });
}

/**
 * Broadcast refreshed gate telemetry metrics
 */
function broadcastTelemetry(eventId, telemetryData) {
  return broadcastToEvent(eventId, {
    type: 'TELEMETRY_UPDATE',
    eventId: String(eventId),
    timestamp: new Date().toISOString(),
    data: telemetryData,
  });
}

/**
 * Get active client count
 */
function getClientCount(eventId = null) {
  if (!eventId) return clients.size;
  const targetId = String(eventId);
  let count = 0;
  for (const c of clients) {
    if (c.subscriptions.has(targetId) || c.subscriptions.size === 0) count++;
  }
  return count;
}

module.exports = {
  initWebSocketServer,
  broadcast,
  broadcastToEvent,
  broadcastScanEvent,
  broadcastTelemetry,
  getClientCount,
  _clients: clients,
};
