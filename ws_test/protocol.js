export const MessageType = {
  Welcome: 1,
  Input: 2,
  State: 3,
};

export const PLAYER_SIZE = 32;
export const MOVE_SPEED = 180;
export const WORLD_WIDTH = 960;
export const WORLD_HEIGHT = 540;

export function colorToCss(value) {
  const r = (value >>> 24) & 0xff;
  const g = (value >>> 16) & 0xff;
  const b = (value >>> 8) & 0xff;
  const a = value & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
}

export function encodeInput(dx, dy) {
  const buffer = new ArrayBuffer(9);
  const view = new DataView(buffer);
  view.setUint8(0, MessageType.Input);
  view.setFloat32(1, dx, true);
  view.setFloat32(5, dy, true);
  return buffer;
}

export function parseMessages(data) {
  const view = new DataView(data);
  const messages = [];
  let offset = 0;

  while (offset < view.byteLength) {
    const type = view.getUint8(offset);

    if (type === MessageType.Welcome) {
      if (offset + 9 > view.byteLength) {
        break;
      }
      messages.push({
        type,
        playerId: view.getUint32(offset + 1, true),
        color: view.getUint32(offset + 5, true),
      });
      offset += 9;
      continue;
    }

    if (type === MessageType.State) {
      if (offset + 5 > view.byteLength) {
        break;
      }
      const playerCount = view.getUint32(offset + 1, true);
      const bytesNeeded = 5 + playerCount * 16;
      if (offset + bytesNeeded > view.byteLength) {
        break;
      }

      const players = [];
      let playerOffset = offset + 5;
      for (let i = 0; i < playerCount; ++i) {
        players.push({
          id: view.getUint32(playerOffset, true),
          x: view.getFloat32(playerOffset + 4, true),
          y: view.getFloat32(playerOffset + 8, true),
          color: view.getUint32(playerOffset + 12, true),
        });
        playerOffset += 16;
      }

      messages.push({ type, players });
      offset += bytesNeeded;
      continue;
    }

    break;
  }

  return messages;
}
