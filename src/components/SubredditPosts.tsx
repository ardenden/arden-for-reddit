import { useRouter } from 'next/router'
import { Row } from 'react-bootstrap'
import { useListingLinks } from '../services/API'
import { useCookie } from './CookieContext'
import Paginate from './Paginate'
import Post from './Post'
import Rank from './Rank'

export default function SubredditPosts() {
  const router = useRouter()
  const cookie = useCookie()
  const { listingLinks } = useListingLinks(router, cookie)

  if (!listingLinks) return <div className="mx-2 lead fw-bold text-orange">loading...</div>

  return (
    <>
      <div className="border-top-0 pt-3 pb-2 mb-2 w-100">
        {
          listingLinks.data.children.map((thingLink, i) => (
            <div key={i}>
              <Row className="lh-sm px-1 mx-0">
                <Rank i={i} dist={listingLinks.data.dist} />
                <Post link={thingLink.data} />
              </Row>
              <hr />
            </div>
          ))
        }
        <div className="px-3">
          <Paginate listBefore={listingLinks.data.before} listAfter={listingLinks.data.after} />
        </div>
      </div>
    </>
  )
}
