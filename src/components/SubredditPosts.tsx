import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Row } from 'react-bootstrap'
import { parseCookie, useListingLinks } from '../services/API'
import { Cookie } from '../types/Cookie'
import Paginate from './Paginate'
import Post from './Post'
import Rank from './Rank'

export default function SubredditPosts() {
  const router = useRouter()
  const [cookie, setCookie] = useState<Cookie>()
  const { listingLinks } = useListingLinks(router, cookie)

  useEffect(() => {
    if (!cookie) {
      setCookie(parseCookie())
    }
  }, [])

  if (!listingLinks) return <div className="mx-2 lead fw-bold text-orange">loading...</div>

  return (
    <>
      {
        listingLinks &&
        <div className="border-top-0 pt-3 pb-2 mb-2">
          {
            listingLinks.data.children.map((thingLink, i) => (
              <div key={i}>
                <Row className="lh-sm px-3">
                  <Rank i={i} />
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
      }
    </>
  )
}
