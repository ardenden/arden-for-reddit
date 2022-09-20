import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Collapse, Container } from 'react-bootstrap'
import { getMoreComments } from '../services/Comments'
import { Comment } from '../types/Comment'
import { More } from '../types/More'
import { Thing } from '../types/Thing'
import { getRelativeTime } from '../utils/DateUtils'
import { formatScore } from '../utils/NumberUtils'

type Props = {
  thingComment: Thing<Comment>
}

export default function Reply({ thingComment }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(thingComment.data.collapsed)
  const [childrenCount, setChildrenCount] = useState(0)
  const [thingComments, setThingComments] = useState<Thing<Comment>[]>([])
  const [isLoading, setIsLoading] = useState(false)

  async function loadMoreComments() {
    setIsLoading(true)
    const thingMoreRef = thingComment.data.replies.data.children.find((tr) => tr.kind === 'more') as Thing<More>
    const moreReplies = await getMoreComments(thingComment)
    thingMoreRef.data.count = moreReplies.count
    thingMoreRef.data.children = moreReplies.children
    setThingComments(thingComments.concat(moreReplies.thingComments))
    setIsLoading(false)
  }

  useEffect(() => {
    let count = 0
    const parent = document.querySelector(`#${thingComment.data.id}`)
    const comments = Array.from(parent!.getElementsByClassName('reply'))
    count += comments.length - 1
    const more = Array.from(parent!.querySelectorAll('[class^=more]'))
    more.forEach(m => {
      count += Number(m.className.substring(m.className.indexOf('-') + 1))
    })
    setChildrenCount(count)
  }, [])

  return (
    <>
      <div id={`${thingComment.data.id}`} className="px-2">
        <div>
          <a onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
            {isCollapsed ? '[+]' : '[–]'}
          </a> {' '}
          <small className={`text-muted ${isCollapsed ? 'fst-italic' : ''}`}>
            {
              thingComment.data.author === '[deleted]'
                ?
                <span className="text-muted">
                  {thingComment.data.author} {' '}
                </span>
                :
                <>
                  <Link href={`/user/${thingComment.data.author}`}>
                    <a className={`fw-bold ${thingComment.data.distinguished
                      ? `text-${thingComment.data.distinguished}`
                      : thingComment.data.is_submitter
                        ? 'text-white bg-blue rounded-1 px-1'
                        : 'text-blue'} ${isCollapsed ? 'text-muted' : ''}`
                    }>
                      {thingComment.data.author}
                    </a>
                  </Link> {' '}
                </>
            }
            <small>
              {
                (thingComment.data.is_submitter || thingComment.data.distinguished) &&
                <span className="ms-1">
                  [<span className={`distinguished ${thingComment.data.distinguished
                    ? `text-${thingComment.data.distinguished}`
                    : 'text-blue'} ${isCollapsed ? 'text-muted' : ''}`}>
                    {thingComment.data.is_submitter ? thingComment.data.distinguished ? 'S,' : 'S' : ''}
                  </span>]
                </span>
              }
              <span className="ms-1">
                {
                  thingComment.data.score_hidden
                    ? '[score hidden]'
                    : `${formatScore(thingComment.data.score)} ${thingComment.data.score === 1 ? 'point' : 'points'}`
                }
              </span>
              <span className="ms-1">{getRelativeTime(thingComment.data.created)}</span>
              <span className="ms-1">
                {isCollapsed && `(${childrenCount} ${childrenCount === 1 ? 'child' : 'children'})`}
              </span>
            </small>
          </small>
        </div>

        <Collapse in={!isCollapsed} timeout={50}>
          <div>
            <div>
              <Container className="mx-0 px-0 reply"
                dangerouslySetInnerHTML={{ __html: thingComment.data.body_html }} />
              <div className="text-muted mt-n1">
                <small>
                  <Link href={thingComment.data.permalink}>
                    <a className="text-gray">permalink</a>
                  </Link>
                  {
                    thingComment.data.parent_id !== thingComment.data.link_id &&
                    <>
                      {' · '}
                      <a href={`#${thingComment.data.parent_id.substring(3)}`} className="text-gray">parent</a>
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
                                    <a onClick={loadMoreComments}
                                      className={`more-${(thingReply.data as More).count}`}
                                      style={{ cursor: 'pointer' }}>
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
