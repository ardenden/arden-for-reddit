import { Comment } from '../types/Comment'
import { Listing } from '../types/Listing'
import { More } from '../types/More'
import { Thing } from '../types/Thing'
import { fetchData, parseCookie } from './API'

export async function getMoreComments(thingReply: Thing<Comment | More>) {
  const cookie = parseCookie()
  let more: More = <More>{}
  let linkId = ''
  let children = ''

  if (thingReply.kind === 't1') {
    const thingComment = <Thing<Comment>>thingReply
    const thingMore = <Thing<More>>thingComment.data.replies.data.children.find((tr) => tr.kind === 'more')
    more = thingMore.data
    linkId = thingComment.data.link_id
    children = thingMore.data.children.splice(0, 100).toString()
  } else {
    const thingMore = <Thing<More>>thingReply
    more = thingMore.data
    linkId = thingMore.data.parent_id
    children = thingMore.data.children.splice(0, 100).toString()
  }

  const moreReplies = await fetchData<{
    json: {
      data: {
        things: Thing<Comment | More>[]
      }
    }
  }>(
    `https://oauth.reddit.com/api/morechildren?link_id=${linkId}&children=${children}&api_type=json`,
    cookie?.access_auth
  )
  const thingReplies = <Thing<Comment | More>[]>JSON.parse(JSON.stringify(moreReplies.json.data.things))

  for (let i = thingReplies.length - 1; i >= 0; i--) {
    const commentRef = thingReplies[i].data as Comment
    commentRef.replies = <Listing<Thing<Comment | More>>>{}
    commentRef.replies.data = {
      before: '',
      after: '',
      modhash: '',
      children: []
    }

    for (let j = thingReplies.length - 1; j >= 0; j--) {
      if (thingReplies[j].data.parent_id === thingReplies[i].data.name) {
        commentRef.replies.data.children.unshift(thingReplies[j])
        thingReplies.splice(j, 1)
      }
    }
  }

  const thingComments = <Thing<Comment>[]>thingReplies.filter((tr) => tr.kind !== 'more')
  const thingMore = <Thing<More> | undefined>thingReplies.find((tr) => tr.kind === 'more')
  more.count -= moreReplies.json.data.things.length

  if (thingMore) {
    more.children = thingMore.data.children.concat(more.children)
  }

  return {
    thingComments: thingComments,
    children: more.children,
    count: more.count
  }
}
