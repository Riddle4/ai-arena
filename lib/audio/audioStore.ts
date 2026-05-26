type AudioRecord = {
  id: string;
  buffer: Buffer;
  contentType: string;
  createdAt: string;
};

type AudioMemoryStore = {
  audio: Map<string, AudioRecord>;
};

declare global {
  var aiArenaAudioStore: AudioMemoryStore | undefined;
}

const store: AudioMemoryStore =
  globalThis.aiArenaAudioStore ??
  {
    audio: new Map<string, AudioRecord>()
  };

globalThis.aiArenaAudioStore = store;

export function addAudio(buffer: Buffer, contentType = "audio/mpeg") {
  const id = crypto.randomUUID();
  store.audio.set(id, {
    id,
    buffer,
    contentType,
    createdAt: new Date().toISOString()
  });
  return id;
}

export function getAudio(audioId: string) {
  return store.audio.get(audioId);
}
