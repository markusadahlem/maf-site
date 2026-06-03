// state-store.ts — versioned, namespaced localStorage.
//
// Keys are namespaced as `<moduleId>:<key>` so multiple modules can coexist.
// Writes go only to the namespaced key. Reads fall back to the un-namespaced
// legacy key for backward compat with user sessions written before the
// migration.
//
// Snapshot API (saveSnapshot / listSnapshots / loadSnapshot) lays the
// foundation for diary-style longitudinal inputs.

const SEP = ":";

interface Wrapped<T> {
  value: T;
  ts: number;
  moduleId: string;
}

export interface Snapshot {
  id: string;
  ts: number;
  metadata: Record<string, unknown>;
  state: Record<string, unknown>;
}

function nsKey(moduleId: string, key: string): string {
  return `${moduleId}${SEP}${key}`;
}

function snapshotsKey(moduleId: string): string {
  return nsKey(moduleId, "_snapshots");
}

function readWrapped<T = unknown>(fullKey: string): T | null {
  const raw = localStorage.getItem(fullKey);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    // Wrapped form: { value, ts, moduleId }
    if (
      parsed &&
      typeof parsed === "object" &&
      "value" in parsed &&
      "ts" in parsed
    ) {
      return (parsed as Wrapped<T>).value;
    }
    // Unwrapped legacy form: the raw parsed value
    return parsed as T;
  } catch {
    return null;
  }
}

function writeWrapped<T>(fullKey: string, value: T, moduleId: string): void {
  const wrapped: Wrapped<T> = { value, ts: Date.now(), moduleId };
  localStorage.setItem(fullKey, JSON.stringify(wrapped));
}

export function get<T = unknown>(moduleId: string, key: string): T | null {
  const namespaced = readWrapped<T>(nsKey(moduleId, key));
  if (namespaced !== null) return namespaced;
  // Legacy fallback: read un-namespaced key directly (no migration write,
  // so legacy callers keep seeing the value too).
  return readWrapped<T>(key);
}

export function set<T>(moduleId: string, key: string, value: T): void {
  writeWrapped(nsKey(moduleId, key), value, moduleId);
}

// Snapshot API ---------------------------------------------------------------

export function saveSnapshot(
  moduleId: string,
  metadata: Record<string, unknown> = {},
): string {
  const snapshot: Snapshot = {
    id:
      (crypto.randomUUID && crypto.randomUUID()) ||
      `snap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    metadata,
    state: {},
  };

  const prefix = `${moduleId}${SEP}`;
  const reserved = snapshotsKey(moduleId);
  for (let i = 0; i < localStorage.length; i++) {
    const fullKey = localStorage.key(i);
    if (!fullKey || !fullKey.startsWith(prefix)) continue;
    if (fullKey === reserved) continue;
    const k = fullKey.slice(prefix.length);
    snapshot.state[k] = get(moduleId, k);
  }

  const snapshots = listSnapshots(moduleId);
  snapshots.push(snapshot);
  writeWrapped(snapshotsKey(moduleId), snapshots, moduleId);
  return snapshot.id;
}

export function listSnapshots(moduleId: string): Snapshot[] {
  return readWrapped<Snapshot[]>(snapshotsKey(moduleId)) || [];
}

export function loadSnapshot(
  moduleId: string,
  snapshotId: string,
): Snapshot | null {
  return listSnapshots(moduleId).find((s) => s.id === snapshotId) || null;
}
