import { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Post from '../../../../../../components/Post'
import Reply from '../../../../../../components/Reply'
import ReplySort from '../../../../../../components/ReplySort'
import SubredditNav from '../../../../../../components/SubredditNav'
import SubredditSidebar from '../../../../../../components/SubredditSidebar'
import { fetchData } from '../../../../../../services/API'
import { getMoreComments } from '../../../../../../services/Comments'
import { Comment } from '../../../../../../types/Comment'
import { Link } from '../../../../../../types/Link'
import { Listing } from '../../../../../../types/Listing'
import { More } from '../../../../../../types/More'
import { Sidebar } from '../../../../../../types/Sidebar'
import { Subreddit } from '../../../../../../types/Subreddit'
import { Thing } from '../../../../../../types/Thing'

type Props = {
  link: Link
  thingReplies: Thing<Comment | More>[]
  thingSubreddit: Thing<Subreddit>
  sidebar: Sidebar
}

const PostPermalinkPage: NextPage<Props> = ({ link, thingReplies, thingSubreddit, sidebar }) => {
  const [thingComments, setThingComments] = useState<Thing<Comment>[]>([])
  const [isLoading, setIsLoading] = useState(false)

  async function loadMoreComments() {
    setIsLoading(true)
    const thingMoreRef = thingReplies.find((thingReply) => thingReply.kind === 'more') as Thing<More>
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
              link &&
              <Row className="mt-3 mb-2 lh-sm px-3">
                <Post link={link} />
              </Row>
            }
            <ReplySort />
            <hr className="mt-0" />
            {
              thingReplies &&
              <>
                {
                  thingReplies.map((thingReply, i) => (
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
          <SubredditSidebar subreddit={thingSubreddit.data} sidebar={sidebar} />
        </Col>
      </Row>
    </>
  )
}

export default PostPermalinkPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { subreddit } = context.query
  const request = `https://oauth.reddit.com${context.resolvedUrl}`
  const cookie = context.req.cookies['access_auth']
  context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const listings = await fetchData<[Listing<Thing<Link>>, Listing<Thing<Comment | More>>]>(request, cookie)
  let thingSubreddit: Thing<Subreddit> | undefined = undefined
  let sidebar: Sidebar | undefined = undefined
  thingSubreddit = await fetchData<Thing<Subreddit>>(`https://oauth.reddit.com/r/${subreddit}/about`, cookie)
  sidebar = await fetchData<Sidebar>(`https://oauth.reddit.com/r/${subreddit}/api/widgets?raw_json=1`, cookie)

  return {
    props: {
      link: listings[0].data.children[0].data,
      thingReplies: listings[1].data.children,
      thingSubreddit: thingSubreddit,
      sidebar: sidebar
    }
  }
}
