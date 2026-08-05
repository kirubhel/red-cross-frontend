import { get, set, update } from 'idb-keyval';
import { toast } from 'sonner';

export type OfflineRequest = {
  id: string;
  url: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
  timestamp: number;
};

const SYNC_QUEUE_KEY = 'ercs_offline_sync_queue';

export async function queueRequest(request: Omit<OfflineRequest, 'id' | 'timestamp'>) {
  const newRequest: OfflineRequest = {
    ...request,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  await update(SYNC_QUEUE_KEY, (queue: OfflineRequest[] = []) => [...queue, newRequest]);
  toast.success('You are offline. Request queued for sync.');
}

export async function getQueuedRequests(): Promise<OfflineRequest[]> {
  return (await get(SYNC_QUEUE_KEY)) || [];
}

export async function clearQueuedRequests() {
  await set(SYNC_QUEUE_KEY, []);
}

export async function removeQueuedRequest(id: string) {
  await update(SYNC_QUEUE_KEY, (queue: OfflineRequest[] = []) => 
    queue.filter((req) => req.id !== id)
  );
}

export async function syncOfflineRequests() {
  const queue = await getQueuedRequests();
  if (queue.length === 0) return;

  toast.info(`Syncing ${queue.length} offline requests...`);

  let successCount = 0;
  for (const req of queue) {
    try {
      const response = await fetch(req.url, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...req.headers,
        },
        body: req.body ? JSON.stringify(req.body) : undefined,
      });

      if (response.ok) {
        await removeQueuedRequest(req.id);
        successCount++;
      }
    } catch (error) {
      console.error('Failed to sync request:', req, error);
    }
  }

  if (successCount > 0) {
    toast.success(`Successfully synced ${successCount} requests.`);
  }
}

// Utility hook/component logic to listen for online events can be placed elsewhere
