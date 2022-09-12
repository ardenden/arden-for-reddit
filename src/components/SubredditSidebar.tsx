import Link from 'next/link'
import { Subreddit } from '../types/Subreddit'
import { getRelativeTime } from '../utils/DateUtils'
import { renderHtml } from '../utils/StringUtils'

type Props = {
  subreddit: Subreddit
}

export default function SubredditSidebar({ subreddit }: Props) {
  return (
    <>
      {
        subreddit &&
        <div className="px-3 py-2 border-start border-secondary">
          <Link href={subreddit.url}>
            <a className="text-dark fw-bold fs-5">{subreddit.display_name}</a>
          </Link>
          <small>
            <div>{subreddit.subscribers.toLocaleString()} subscribers</div>
            <div>🟢 {subreddit.accounts_active.toLocaleString()} users online</div>
            <div className="text-muted">a community for {getRelativeTime(subreddit.created_utc).replace(' ago', '')}</div>
          </small>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: renderHtml(subreddit.description_html) }} style={{ width: '300px' }} />
        </div>
      }
    </>
  )
}
