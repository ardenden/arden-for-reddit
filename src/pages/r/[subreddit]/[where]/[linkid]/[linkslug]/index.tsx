import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Post from '../../../../../../components/Post'
import Reply from '../../../../../../components/Reply'
import ReplySort from '../../../../../../components/ReplySort'
import SubredditNav from '../../../../../../components/SubredditNav'
import SubredditSidebar from '../../../../../../components/SubredditSidebar'
import { useSubredditPage, parseCookie } from '../../../../../../services/API'
import { getMoreComments } from '../../../../../../services/Comments'
import { Comment } from '../../../../../../types/Comment'
import { Link } from '../../../../../../types/Link'
import { Listing } from '../../../../../../types/Listing'
import { More } from '../../../../../../types/More'
import { Thing } from '../../../../../../types/Thing'
import { useRouter } from 'next/router'
import { Cookie } from '../../../../../../types/Cookie'

type PermaLink = [Listing<Thing<Link>>, Listing<Thing<Comment | More>>]

const PostPermalinkPage: NextPage = () => {
  const router = useRouter()
  const [thingComments, setThingComments] = useState<Thing<Comment>[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [cookie, setCookie] = useState<Cookie>()
  const { listings } = useSubredditPage(router, cookie)
  const { thingSubreddit } = useSubredditPage(router, cookie)
  const { sidebar } = useSubredditPage(router, cookie)

  useEffect(() => {
    if (!cookie) {
      setCookie(parseCookie())
    }
  }, [])

  async function loadMoreComments() {
    setIsLoading(true)
    const thingMoreRef = (listings as PermaLink)[1].data.children
      .find((thingReply) => thingReply.kind === 'more') as Thing<More>
    const moreReplies = await getMoreComments(thingMoreRef)
    thingMoreRef.data.count = moreReplies.count
    thingMoreRef.data.children = moreReplies.children
    setThingComments(thingComments.concat(moreReplies.thingComments))
    setIsLoading(false)
  }

  return (
    <>
      <SubredditNav thingSubreddit={thingSubreddit} />
      <Row>
        <Col className="pe-0">
          <div className="mb-3">
            {
              listings &&
              <Row className="mt-3 mb-2 lh-sm px-3">
                <Post link={(listings as PermaLink)[0].data.children[0].data} />
              </Row>
            }
            <ReplySort />
            <hr className="mt-0" />
            {
              listings &&
              <>
                {
                  (listings as PermaLink)[1].data.children.map((thingReply, i) => (
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
                          <div>
                            <div className="px-2">
                              <Reply thingComment={thingReply as Thing<Comment>} />
                            </div>
                            <hr />
                          </div>
                      }
                    </div>
                  ))
                }
              </>
            }
          </div>
        </Col>
        <Col className="col-auto ps-0">
          <SubredditSidebar subreddit={thingSubreddit?.data} sidebar={sidebar} />
        </Col>
      </Row>
    </>
  )
}

export default PostPermalinkPage
