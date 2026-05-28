// state-store.js — versioned, namespaced localStorage.
//
// Keys are namespaced as `<moduleId>:<key>` so multiple modules can coexist.
// Writes go only to the namespaced key. Reads fall back to the un-namespaced
// legacy key for backward compat with user sessions written before Phase 4.
//
// Snapshot API (saveSnapshot / listSnapshots / loadSnapshot) lays the
// foundation for diary-style longitudinal inputs.

const SEP = ":";

function nsKey(moduleId, key) {
    return `${moduleId}${SEP}${key}`;
}

function snapshotsKey(moduleId) {
    return nsKey(moduleId, "_snapshots");
}

function readWrapped(fullKey) {
    const raw = localStorage.getItem(fullKey);
    if (raw === null) return null;
    try {
        const parsed = JSON.parse(raw);
        // Wrapped form: { value, ts, moduleId }
        if (parsed && typeof parsed === "object" && "value" in parsed && "ts" in parsed) {
            return parsed.value;
        }
        // Unwrapped legacy form: the raw parsed value
        return parsed;
    } catch {
        return null;
    }
}

function writeWrapped(fullKey, value, moduleId) {
    const wrapped = { value, ts: Date.now(), moduleId };
    localStorage.setItem(fullKey, JSON.stringify(wrapped));
}

export function get(moduleId, key) {
    const namespaced = readWrapped(nsKey(moduleId, key));
    if (namespaced !== null) return namespaced;
    // Legacy fallback: read un-namespaced key directly (no migration write,
    // so legacy callers keep seeing the value too).
    return readWrapped(key);
}

export function set(moduleId, key, value) {
    writeWrapped(nsKey(moduleId, key), value, moduleId);
}

// Snapshot API ---------------------------------------------------------------

export function saveSnapshot(moduleId, metadata = {}) {
    const snapshot = {
        id: (crypto.randomUUID && crypto.randomUUID()) || `snap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ts: Date.now(),
        metadata,
        state: {},
    };

    const prefix = `${moduleId}${SEP}`;
    const reserved = snapshotsKey(moduleId);
    for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i);
        if (!fullKey.startsWith(prefix)) continue;
        if (fullKey === reserved) continue;
        const k = fullKey.slice(prefix.length);
        snapshot.state[k] = get(moduleId, k);
    }

    const snapshots = listSnapshots(moduleId);
    snapshots.push(snapshot);
    writeWrapped(snapshotsKey(moduleId), snapshots, moduleId);
    return snapshot.id;
}

export function listSnapshots(moduleId) {
    return readWrapped(snapshotsKey(moduleId)) || [];
}

export function loadSnapshot(moduleId, snapshotId) {
    return listSnapshots(moduleId).find((s) => s.id === snapshotId) || null;
}
