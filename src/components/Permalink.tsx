import { useContext } from 'react'
import { Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { usePermaLink } from '../services/API'
import Post from './Post'
import ReplySort from './ReplySort'
import { CookieContext } from './CookieContext'
import PermalinkReplies from './PermalinkReplies'

export default function Permalink() {
  const router = useRouter()
  const cookie = useContext(CookieContext)
  const { listingLinks } = usePermaLink(router, cookie)

  if (!listingLinks) return <div className="mx-2 lead fw-bold text-orange">loading...</div>

  return (
    <div className="mb-3">
      <Row className="mt-3 mb-2 lh-sm px-2">
        <Post link={listingLinks.data.children[0].data} />
      </Row>
      <ReplySort />
      <hr className="mt-0" />
      <PermalinkReplies />
    </div>
  )
}
