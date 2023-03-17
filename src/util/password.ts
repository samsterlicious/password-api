export function getPassword(key: string) {
  return key.replace(/^.+#(.+)#.+$/, "$1");
}
