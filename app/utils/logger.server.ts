// いったん仮で
export const logger = {
  info(message: string) {
    console.log(`${new Date()} ${message}`);
  },
  error(message: string, e?: unknown) {
    console.error(`${new Date()} ${message}`, e);
  },
};
