import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Collapse, Container } from 'react-bootstrap'
import { getMoreComments } from '../services/Comments'
import { Comment } from '../types/Comment'
import { More } from '../types/More'
import { Thing } from '../types/Thing'
import { getRelativeTime } from '../utils/DateUtils'
import { formatScore } from '../utils/NumberUtils'
import { renderHtml } from '../utils/StringUtils'

type Props = {
  thingComment: Thing<Comment>
}

export default function Reply({ thingComment }: Props) {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(thingComment.data.collapsed)
  const [thingComments, setThingComments] = useState<Thing<Comment>[]>([])
  const [isLoading, setIsLoading] = useState(false)

  async function loadMoreComments() {
    setIsLoading(true)
    const thingMoreRef = thingComment.data.replies.data.children.find((comment) => comment.kind === 'more') as Thing<More>
    const moreReplies = await getMoreComments(thingComment)
    thingMoreRef.data.count = moreReplies.count
    thingMoreRef.data.children = moreReplies.children
    setThingComments(thingComments.concat(moreReplies.thingComments))
    setIsLoading(false)
  }

  return (
    <>
      <div className="px-2">
        <div>
          <a onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
            {isCollapsed ? '[+]' : '[–]'}
          </a> {' '}
          <small className={`text-muted ${isCollapsed ? 'fst-italic' : ''}`}>
            <Link href={`/user/${thingComment.data.author}`}>
              <a className={`text-blue fw-bold ${isCollapsed ? 'text-muted' : ''}`}>
                {thingComment.data.author}
              </a>
            </Link> {' · '}
            <small>
              {
                thingComment.data.score_hidden
                  ? '[score hidden]'
                  : `${formatScore(thingComment.data.score)} points`
              }
              {' · '}
              {getRelativeTime(thingComment.data.created)}
            </small>
          </small>
        </div>

        <Collapse in={!isCollapsed} timeout={50}>
          <div>
            <div>
              <Container className="mx-0 px-0 reply"
                dangerouslySetInnerHTML={{ __html: renderHtml(thingComment.data.body_html) }} />
              <div className="text-muted mt-n1">
                <small>
                  <Link href={thingComment.data.permalink}>
                    <a className="text-gray">permalink</a>
                  </Link>
                  {
                    thingComment.data.parent_id !== thingComment.data.link_id &&
                    <>
                      {' · '}
                      <Link href={`${router.asPath}/${thingComment.data.parent_id.substring(3)}`}>
                        <a className="text-gray">parent</a>
                      </Link>
                    </>
                  }
                </small>
              </div>
            </div>

            {
              thingComment.data.replies &&
              <>
                {
                  thingComment.data.replies.data.children.map((thingReply, i) => (
                    <div key={i}>
                      {
                        thingReply.kind === 'more'
                          ?
                          <>
                            {
                              thingComments.length > 0 &&
                              thingComments.map((thingComment, i) => (
                                <div key={i}>
                                  <div className="ps-4 mb-n1 mt-3 border-start border-secondary">
                                    <Reply thingComment={thingComment as Thing<Comment>} />
                                  </div>
                                </div>
                              ))
                            }

                            {
                              isLoading
                                ? <div className="mt-2"><small className="text-orange fw-bold">loading...</small></div>
                                : (thingReply.data as More).children.length > 0 &&
                                <div className="mt-2">
                                  <small>
                                    <a onClick={loadMoreComments} style={{ cursor: 'pointer' }}>
                                      <span className="text-blue fw-bold">load more comments</span> {' '}
                                      <span className="text-muted fw-normal">
                                        ({(thingReply.data as More).count} replies)
                                      </span>
                                    </a>
                                  </small>
                                </div>
                            }
                          </>
                          :
                          <div className="ps-4 mb-n1 mt-3 border-start border-secondary">
                            <Reply thingComment={thingReply as Thing<Comment>} />
                          </div>
                      }
                    </div>
                  ))
                }
              </>
            }
          </div>
        </Collapse>
      </div>
    </>
  )
}
