// utils/resendThrottle.ts
type QueueItem<T> = {
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (err: any) => void;
};

class RateLimiter {
  private queue: QueueItem<any>[] = [];
  private lastExecution = 0;
  private intervalMs: number;
  private maxCallsPerInterval: number;
  private callsThisInterval = 0;

  constructor(maxCallsPerSecond: number) {
    this.maxCallsPerInterval = maxCallsPerSecond;
    this.intervalMs = 1000; // 1 second
    setInterval(() => {
      this.callsThisInterval = 0; // reset counter each second
      this.runNext();
    }, this.intervalMs);
  }

  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.runNext();
    });
  }

  private runNext() {
    while (this.queue.length && this.callsThisInterval < this.maxCallsPerInterval) {
      const item = this.queue.shift()!;
      this.callsThisInterval++;
      item.fn()
        .then(item.resolve)
        .catch(item.reject);
    }
  }
}

// export a singleton limiter for Resend
export const resendLimiter = new RateLimiter(2);
