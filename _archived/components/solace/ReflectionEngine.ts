export type ReflectionState =
  | "idle"
  | "typing"
  | "paused"
  | "breathing"
  | "responding"
  | "editing";

export type ReflectionEngineConfig = {
  pauseDelay: number;
  breathingDuration: number;
};

export const defaultReflectionConfig: ReflectionEngineConfig = {
  pauseDelay: 900,
  breathingDuration: 1400,
};

export function detectPause(
  lastInputTime: number,
  now: number,
  pauseDelay: number
) {
  return now - lastInputTime > pauseDelay;
}

export function nextState(
  current: ReflectionState,
  hasText: boolean,
  paused: boolean
): ReflectionState {
  switch (current) {
    case "idle":
      return hasText ? "typing" : "idle";

    case "typing":
      return paused ? "breathing" : "typing";

    case "breathing":
      return "responding";

    case "responding":
      return "editing";

    case "editing":
      return hasText ? "typing" : "idle";

    default:
      return "idle";
  }
}