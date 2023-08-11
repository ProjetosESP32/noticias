export function* nextItem(arr) {
  if (arr.length === 0) return

  let lastIdx = 0

  while (true) {
    if (lastIdx >= arr.length) lastIdx = 0

    yield arr[lastIdx++]
  }
}
