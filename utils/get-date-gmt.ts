export function DateGMT() {
  return new Date(new Date().getTime() + (-3 * 60 * 60 * 1000));
}
