interface CountDown {
  h: number;
  hh: string;
  m: number;
  mm: string;
  s: number;
  ss: string;
}
interface InputOptions {
  h?: number;
  m?: number;
  s?: number;
}
interface CallbackOptions {
  listen?: (countdown: CountDown) => void;
  done?: (...args: any[]) => void;
  autoStart?: boolean;
}

const convert = (time: number) => {
  const toTwoDigit = (d: number) => Math.floor(d / 10) + "" + (d % 10);
  const h = Math.floor(time / (60 * 60));
  const hh = toTwoDigit(h);
  let m = Math.floor(time / 60);
  m = ((m % 60) + 60) % 60;
  const mm = toTwoDigit(m);
  const s = time % 60;
  const ss = toTwoDigit(s);

  return {
    hh,
    h,
    mm,
    m,
    ss,
    s,
  };
};

export const createCountdown = (
  { h = 0, m = 0, s = 0 }: InputOptions,
  callbackOptions?: CallbackOptions
) => {
  const listen = callbackOptions?.listen;
  const done = callbackOptions?.done;
  const autoStart = callbackOptions?.autoStart ?? true;

  let timeLimit = 0;
  let timeStart = 0;
  let interval: number;

  const set = ({ h = 0, m = 0, s = 0 }) => {
    timeLimit = h * 60 * 60 + m * 60 + s;
  };

  set({ h, m, s });

  const start = () => {
    listen?.(convert(timeLimit - timeStart));
    interval = setInterval(() => {
      timeStart += 1;
      listen?.(convert(timeLimit - timeStart));
      if (timeStart === timeLimit) {
        done?.();
        clearInterval(interval);
      }
    }, 1000);
  };
  autoStart && start();

  return {
    start,
    reset: () => {
      timeStart = 0;
      listen?.(convert(timeLimit - timeStart));
      clearInterval(interval);
    },
    stop: () => {
      clearInterval(interval);
    },
    set,
    get: () => {
      return {
        ...convert(timeLimit - timeStart),
        remainingSec: timeLimit - timeStart,
      };
    },
  };
};
