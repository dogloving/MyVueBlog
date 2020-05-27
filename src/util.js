export function format(s, length, c) {
  while (s.length < length) s = c+s
  return s
}