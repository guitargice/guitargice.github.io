import {
  MessageType,
  PLAYER_SIZE,
  MOVE_SPEED,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  encodeInput,
  parseMessages,
  colorToCss,
} from "./protocol.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");
const serverInput = document.getElementById("server-url");
const connectBtn = document.getElementById("connect-btn");
const playerListEl = document.getElementById("player-list");

const keys = new Set();
const players = new Map();

let ws = null;
let localPlayerId = null;
let lastFrameTime = performance.now();

function setStatus(text, kind = "") {
  statusEl.textContent = text;
  statusEl.dataset.kind = kind;
}

function defaultServerUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("server") || "wss://nullvector.playit.plus";
}

function clamp(value, lo, hi) {
  return Math.max(lo, Math.min(value, hi));
}

function resizeCanvas() {
  const maxWidth = Math.min(window.innerWidth - 32, 960);
  const maxHeight = Math.min(window.innerHeight - 220, 540);
  const scale = Math.min(maxWidth / WORLD_WIDTH, maxHeight / WORLD_HEIGHT, 1);

  canvas.width = WORLD_WIDTH;
  canvas.height = WORLD_HEIGHT;
  canvas.style.width = `${WORLD_WIDTH * scale}px`;
  canvas.style.height = `${WORLD_HEIGHT * scale}px`;
}

function readInput(deltaSeconds) {
  let dx = 0;
  let dy = 0;

  if (keys.has("ArrowLeft") || keys.has("a")) {
    dx -= MOVE_SPEED * deltaSeconds;
  }
  if (keys.has("ArrowRight") || keys.has("d")) {
    dx += MOVE_SPEED * deltaSeconds;
  }
  if (keys.has("ArrowUp") || keys.has("w")) {
    dy -= MOVE_SPEED * deltaSeconds;
  }
  if (keys.has("ArrowDown") || keys.has("s")) {
    dy += MOVE_SPEED * deltaSeconds;
  }

  return { dx, dy };
}

function applyLocalMove(dx, dy) {
  if (localPlayerId == null) {
    return;
  }

  const player = players.get(localPlayerId);
  if (!player) {
    return;
  }

  const maxX = WORLD_WIDTH - PLAYER_SIZE;
  const maxY = WORLD_HEIGHT - PLAYER_SIZE;
  player.x = clamp(player.x + dx, 0, maxX);
  player.y = clamp(player.y + dy, 0, maxY);
}

function updatePlayerList() {
  const lines = Array.from(players.values())
    .sort((a, b) => a.id - b.id)
    .map((player) => {
      const marker = player.id === localPlayerId ? " (you)" : "";
      return `P${player.id}${marker}: (${player.x.toFixed(0)}, ${player.y.toFixed(0)})`;
    });

  playerListEl.textContent = lines.length ? lines.join("\n") : "No players yet";
}

function render() {
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  for (const player of players.values()) {
    ctx.fillStyle = colorToCss(player.color);
    ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);

    if (player.id === localPlayerId) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(player.x + 1, player.y + 1, PLAYER_SIZE - 2, PLAYER_SIZE - 2);
    }
  }

  ctx.fillStyle = "#cccccc";
  ctx.font = "14px Segoe UI, sans-serif";
  ctx.fillText("WASD / arrows to move", 12, 22);
  updatePlayerList();
}

function handleMessage(event) {
  const data = event.data instanceof ArrayBuffer
    ? event.data
    : event.data.buffer.slice(event.data.byteOffset, event.data.byteOffset + event.data.byteLength);

  for (const message of parseMessages(data)) {
    if (message.type === MessageType.Welcome) {
      localPlayerId = message.playerId;
      players.set(message.playerId, {
        id: message.playerId,
        x: WORLD_WIDTH * 0.5,
        y: WORLD_HEIGHT * 0.5,
        color: message.color,
      });
      setStatus(`Connected as player ${message.playerId}`, "ok");
      continue;
    }

    if (message.type === MessageType.State) {
      for (const player of message.players) {
        players.set(player.id, player);
      }
    }
  }
}

function connect() {
  if (ws) {
    ws.close();
    ws = null;
  }

  players.clear();
  localPlayerId = null;

  const url = serverInput.value.trim();
  if (!url) {
    setStatus("Enter a WebSocket URL", "error");
    return;
  }

  setStatus(`Connecting to ${url}...`, "pending");

  ws = new WebSocket(url);
  ws.binaryType = "arraybuffer";

  ws.onopen = () => {
    setStatus("Connected, waiting for welcome...", "ok");
  };

  ws.onmessage = handleMessage;

  ws.onclose = () => {
    setStatus("Disconnected", "error");
    ws = null;
  };

  ws.onerror = () => {
    setStatus("Connection failed", "error");
  };
}

function frame(now) {
  const deltaSeconds = Math.min((now - lastFrameTime) / 1000, 0.05);
  lastFrameTime = now;

  if (ws && ws.readyState === WebSocket.OPEN) {
    const { dx, dy } = readInput(deltaSeconds);
    if (dx !== 0 || dy !== 0) {
      ws.send(encodeInput(dx, dy));
      applyLocalMove(dx, dy);
    }
  }

  render();
  requestAnimationFrame(frame);
}

window.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  keys.add(key);
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  keys.delete(key);
});

connectBtn.addEventListener("click", connect);
window.addEventListener("resize", resizeCanvas);

serverInput.value = defaultServerUrl();
resizeCanvas();
requestAnimationFrame(frame);
