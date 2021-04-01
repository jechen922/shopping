export default function (timestamp) {
  const t = Number(timestamp) * 1000
  const date = new Date(t)

  return date.getFullYear() +
  '-' + (date.getMonth() + 1).toString().padStart(2, '0') +
  '-' + date.getDate().toString().padStart(2, '0') +
  ' ' + date.getHours().toString().padStart(2, '0') +
  ':' + date.getMinutes().toString().padStart(2, '0')
}
