export function getRelativeTime(timestamp: number): string {
  const date = new Date()
  const currentTimestamp = Math.floor(date.getTime() / 1000)
  const difference = currentTimestamp - timestamp
  let output = ''

  if (difference < 60) {
    output = `${difference} seconds ago`
  } else if (difference < 3600) {
    output = `${Math.floor(difference / 60)} minutes ago`
  } else if (difference < 86400) {
    output = `${Math.floor(difference / 3600)} hours ago`
  } else if (difference < 2620800) {
    output = `${Math.floor(difference / 86400)} days ago`
  } else if (difference < 31449600) {
    output = `${Math.floor(difference / 2620800)} months ago`
  } else {
    output = `${Math.floor(difference / 31449600)} years ago`
  }

  return output
}

export function getFullDate(timestamp: number, monthOption: 'long' | 'short'): string {
  const date = new Date(timestamp * 1000)
  const output = date.toLocaleString('en-US', {
    month: monthOption,
    day: 'numeric',
    year: 'numeric'
  })

  return output
}
