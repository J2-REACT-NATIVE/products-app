export const delay = (ms: number) => {
  return new Promise((resolv) => setTimeout(resolv, ms));
};
