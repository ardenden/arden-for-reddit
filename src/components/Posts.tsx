import { useRouter } from 'next/router'
import { Row } from 'react-bootstrap'
import { useListingLinks, usePermaLink } from '../services/API'
import { useCookie } from './CookieContext'
import Paginate from './Paginate'
import Post from './Post'
import Rank from './Rank'

export default function Posts() {
  const router = useRouter()
  const cookie = useCookie()
  const { listingDuplicates } = usePermaLink(router, cookie)
  const { listingLinks } = useListingLinks(router, cookie)
  const listingPosts = listingLinks ? listingLinks : listingDuplicates && listingDuplicates

  if (!listingPosts) return <div className="mx-2 lead fw-bold text-orange">loading...</div>

  return (
    <>
      <div className="border-top-0 pt-3 pb-2 mb-2 w-100">
        {
          listingPosts.data.children.map((thingLink, i) => (
            <div key={i}>
              <Row className="lh-sm px-1 mx-0">
                <Rank i={i} dist={listingPosts.data.dist} />
                <Post link={thingLink.data} />
              </Row>
              <hr />
            </div>
          ))
        }
        <div className="px-3">
          <Paginate listBefore={listingPosts.data.before} listAfter={listingPosts.data.after} />
        </div>
      </div>
    </>
  )
}
