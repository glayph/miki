# Hermes Agent Bridge Specification

The **Hermes Agent Bridge** provides low-latency, bidirectional socket streaming protocol (`ws://` or `wss://`) between Miki ReAct runtimes and remote containerized agent tool services.

---

## 1. Protocol Architecture

Hermes operates over standard JSON-RPC 2.0 wrapped in a persistent WebSocket connection with mTLS (Mutual TLS) authentication.

```
┌────────────────────┐     JSON-RPC 2.0 WebSocket Stream     ┌─────────────────────────┐
│ Miki Agent Runtime ├──────────────────────────────────────►│ Remote Hermes Container │
│ (Local ReAct Loop) │◄──────────────────────────────────────┤ (Sandboxed Tools Engine)│
└────────────────────┘             mTLS Secured              └─────────────────────────┘
```

---

## 2. Bridge Configuration Schema

Store your Hermes bridge credentials and connection options in `hermes-bridge.config.json`:

```json
{
  "bridge": "hermes-v1",
  "endpoint": "wss://hermes-cluster.internal:9090/stream",
  "protocol": "json-rpc-2.0",
  "mTLS": {
    "certPath": "./certs/hermes_client.crt",
    "keyPath": "./certs/hermes_client.key",
    "caPath": "./certs/hermes_ca.crt"
  },
  "timeoutMs": 15000,
  "heartbeatIntervalMs": 5000
}
```

---

## 3. TypeScript Integration Example

```typescript
import { HermesSkillAdapter } from "miki/bridges/hermes";
import { MikiAgent } from "miki";

const hermesBridge = new HermesSkillAdapter({
  configPath: "./hermes-bridge.config.json",
  streamOutput: true
});

const agent = new MikiAgent({ name: "HermesWorker" });
await agent.use(hermesBridge);

const result = await agent.run("Execute python data modeling script on Hermes cluster.");
```

---

## 4. Key Performance Characteristics

* **Latency**: < 12ms round-trip execution for local container bridges.
* **Concurrency**: Up to 256 parallel RPC channels per socket session.
* **Compression**: Deflate framing enabled by default for large data payloads.
