export function formatTime(time) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.round(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function formatRecordTime(time) {
  const seconds = Math.floor(time / 1000)
  return `${seconds.toString().padStart(2, "0")}`
}
