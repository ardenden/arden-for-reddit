export function formatScore(value: number): string {
  if (value >= 10000) {
    let formatted = new Intl.NumberFormat(undefined, {
      notation: 'compact',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value)

    const int = formatted.substring(0, formatted.indexOf('.'))
    const dec = Number(formatted.substring(0, formatted.length - 1))
    const affix = formatted.substring(formatted.length - 1)

    if (int.length === 3) {
      formatted = `${Math.round(dec)}${affix}`
    }

    return formatted.toLowerCase()
  }

  return value.toString()
}
