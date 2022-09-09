import { Created } from './Created'
import { Listing } from './Listing'
import { More } from './More'
import { Thing } from './Thing'
import { Votable } from './Votable'

export interface Comment extends Created, Votable {
  id: string
  name: string
  approved_by: string | null
  author: string
  author_flair_css_class: string
  author_flair_text: string
  banned_by: string | null
  body: string
  body_html: string
  edited: Date | boolean
  gilded: number
  link_author: string
  link_id: string
  link_title: string
  link_url: string
  num_reports: number
  parent_id: string
  replies: Listing<Thing<Comment | More>>
  saved: boolean
  score: number
  score_hidden: boolean
  subreddit: string
  subreddit_id: string
  distinguished: string | null
  permalink: string
  collapsed: boolean
}
