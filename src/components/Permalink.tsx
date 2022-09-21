import { Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { usePermaLink } from '../services/API'
import Post from './Post'
import ReplySort from './ReplySort'
import { useCookie } from './CookieContext'
import PermalinkReplies from './PermalinkReplies'

export default function Permalink() {
  const router = useRouter()
  const cookie = useCookie()
  const { listingLinks } = usePermaLink(router, cookie)

  if (!listingLinks) return <div className="mx-2 lead fw-bold text-orange">loading...</div>

  return (
    <div className="mb-3">
      <Row className="mt-3 mb-2 lh-sm px-2">
        <Post link={listingLinks.data.children[0].data} />
      </Row>
      <ReplySort suggestedSort={listingLinks.data.children[0].data.suggested_sort} />
      <hr className="mt-0" />
      <PermalinkReplies />
    </div>
  )
}
