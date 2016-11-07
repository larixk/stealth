export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export const sample = (array) => array[Math.floor(Math.random() * array.length)];

export const lerp = (a, b, t) => a + (t * (b - a));

export const noop = a => a;

export const now = () => new Date().getTime();

export const rand = (from, to = 0) => from + (Math.random() * (to - from));

export const distance = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

export const direction = (p1, p2) => Math.atan2(p2.y - p1.y, p2.x - p1.x);

export const throttle = (f, t) => {
  let lastCall = 0;
  return (...args) => {
    const currentCall = now();
    if (currentCall - lastCall < t) {
      return args[0];
    }
    lastCall = currentCall;
    return f(...args);
  };
};

export const times = (n, f) => {
  const results = [];
  for (let i = 0; i < n; i += 1) {
    results.push(f(i));
  }
  return results;
};
