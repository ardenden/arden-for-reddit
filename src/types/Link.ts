import { Created } from './Created'
import { Votable } from './Votable'

export interface Link extends Created, Votable {
  id: string
  name: string
  author: string
  author_flair_css_class: string
  author_flair_text: string
  author_flair_richtext?: {
    e: string
    a?: string
    t?: string
    u?: string
  }[]
  clicked: boolean
  domain: string
  hidden: boolean
  is_self: boolean
  link_flair_css_class: string
  link_flair_text: string
  link_flair_richtext?: {
    e: string
    a?: string
    t?: string
    u?: string
  }[]
  locked: boolean
  media: { [key: string]: any } | null
  media_embed: { [key: string]: any }
  num_comments: number
  over_18: boolean
  permalink: string
  saved: boolean
  score: number
  selftext: string
  selftext_html: string
  subreddit: string
  subreddit_id: string
  thumbnail: string
  title: string
  url: string
  edited: number
  distinguished: string
  stickied: boolean
  suggested_sort: string
  num_duplicates: number
}
