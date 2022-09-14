export interface Sidebar {
  items: {
    [key: string]: Info | Rule | Extra | Community
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
  text: string
  textHtml: string
}

export interface Community {
  kind: 'community-list'
  shortName: string
  data: {
    name: string
    subscribers: number
  }[]
}
