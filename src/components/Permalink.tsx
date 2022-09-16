import { useEffect, useState } from 'react'
import { Row } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { Thing } from '../types/Thing'
import { More } from '../types/More'
import { Comment } from '../types/Comment'
import { parseCookie, usePermaLink } from '../services/API'
import { getMoreComments } from '../services/Comments'
import { Cookie } from '../types/Cookie'
import Post from './Post'
import Reply from './Reply'
import ReplySort from './ReplySort'

export default function Permalink() {
  const router = useRouter()
  const [cookie, setCookie] = useState<Cookie>()
  const [isLoading, setIsLoading] = useState(false)
  const [thingComments, setThingComments] = useState<Thing<Comment>[]>([])
  const { listings } = usePermaLink(router, cookie)

  useEffect(() => {
    if (!cookie) {
      setCookie(parseCookie())
    }
  }, [])

  async function loadMoreComments() {
    setIsLoading(true)
    const thingMoreRef = listings![1].data.children.find((tr) => tr.kind === 'more') as Thing<More>
    const moreReplies = await getMoreComments(thingMoreRef)
    thingMoreRef.data.count = moreReplies.count
    thingMoreRef.data.children = moreReplies.children
    setThingComments(thingComments.concat(moreReplies.thingComments))
    setIsLoading(false)
  }

  if (!listings) return <div className="mx-2 lead fw-bold text-orange">loading...</div>

  return (
    <>
      <div className="mb-3">
        {
          listings &&
          <Row className="mt-3 mb-2 lh-sm px-2">
            <Post link={listings[0].data.children[0].data} />
          </Row>
        }

        <ReplySort />
        <hr className="mt-0" />

        {
          listings &&
          <>
            {
              listings[1].data.children.map((thingReply, i) => (
                <div key={i}>
                  {
                    thingReply.kind === 'more'
                      ?
                      <div className="px-2">
                        {
                          thingComments.length > 0 &&
                          thingComments.map((thingComment, i) => (
                            <div key={i}>
                              <Reply thingComment={thingComment as Thing<Comment>} />
                              <hr />
                            </div>
                          ))
                        }

                        {
                          isLoading
                            ? <small className="text-orange fw-bold px-2">loading...</small>
                            : (thingReply.data as More).children.length > 0 &&
                            <small>
                              <a onClick={loadMoreComments} style={{ cursor: 'pointer' }}>
                                <span className="text-blue fw-bold px-2">load more comments</span> {' '}
                                <span className="text-muted fw-normal">({(thingReply.data as More).count} replies)</span>
                              </a>
                            </small>
                        }
                      </div>
                      :
                      <>
                        <div className="px-2">
                          <Reply thingComment={thingReply as Thing<Comment>} />
                        </div>
                        <hr />
                      </>
                  }
                </div>
              ))
            }
          </>
        }
      </div>
    </>
  )
}
