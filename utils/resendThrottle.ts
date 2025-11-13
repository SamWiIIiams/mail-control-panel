// utils/resendThrottle.ts
export async function rateLimited<T>(fn: () => Promise<T>, delayMs = 600): Promise<T> {
  // Wait for the delay before executing
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return fn();
}
