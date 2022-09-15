export interface Widget {
  items: {
    [key: string]: Info | Rule | Extra | Community | Menu1 | Menu2 | Calendar | Button
  }
}

export interface Info {
  kind: 'id-card'
  shortName: string
  description: string
  subscribersCount: number
  currentlyViewingCount: number
}

export interface Rule {
  kind: 'subreddit-rules'
  shortName: string
  data: {
    priority: number
    shortName: string
    description: string
    descriptionHtml: string
  }[]
}

export interface Extra {
  kind: 'textarea'
  shortName: string
  id: string
  text: string
  textHtml: string
}

export interface Community {
  kind: 'community-list'
  shortName: string
  id: string
  data: {
    name: string
    subscribers: number
  }[]
}

export interface Menu1 {
  kind: 'menu'
  data: {
    url: string
    text: string
  }[]
}

export interface Menu2 {
  kind: 'menu'
  data: {
    text: string
    children: {
      url: string
      text: string
    }[]
  }[]
}

export interface Calendar {
  kind: 'calendar'
  shortName: string
  data: {
    titleHtml: string
    startTime: number
    endTime: number
  }[]
}

export interface Button {
  kind: 'button'
  shortName: string
  buttons: {
    url: string
    text: string
  }[]
}
