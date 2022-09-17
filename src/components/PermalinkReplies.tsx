import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Thing } from '../types/Thing'
import { More } from '../types/More'
import { Comment } from '../types/Comment'
import { usePermaLink } from '../services/API'
import { getMoreComments } from '../services/Comments'
import Reply from './Reply'
import { CookieContext } from './CookieContext'

export default function PermalinkReplies() {
  const router = useRouter()
  const cookie = useContext(CookieContext)
  const [isLoading, setIsLoading] = useState(false)
  const [thingComments, setThingComments] = useState<Thing<Comment>[]>([])
  const { listingReplies } = usePermaLink(router, cookie)

  async function loadMoreComments() {
    setIsLoading(true)
    const thingMoreRef = listingReplies!.data.children.find((tr) => tr.kind === 'more') as Thing<More>
    const moreReplies = await getMoreComments(thingMoreRef)
    thingMoreRef.data.count = moreReplies.count
    thingMoreRef.data.children = moreReplies.children
    setThingComments(thingComments.concat(moreReplies.thingComments))
    setIsLoading(false)
  }

  if (!listingReplies) return <div className="mt-n3 mx-2 lead fw-bold text-orange">loading...</div>

  return (
    <>
      {
        listingReplies.data.children.map((thingReply, i) => (
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
  )
}
