import { AccessAuth } from '../types/AccessAuth'
import { Cookie } from '../types/Cookie'
import { Subreddit } from '../types/Subreddit'
import { Thing } from '../types/Thing'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { Sidebar } from '../types/Sidebar'
import { More } from '../types/More'
import { Listing } from '../types/Listing'
import { Link } from '../types/Link'
import { Comment } from '../types/Comment'
import { NextRouter } from 'next/router'

export async function authenticateClient(): Promise<AccessAuth> {
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${process.env.AUTHENTICATION_KEY}`
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
      'device_id': 'DO_NOT_TRACK_THIS_DEVICE'
    })
  })
  const accessAuth = <AccessAuth>await response.json()

  return accessAuth
}

function setHeaders(accessAuthString?: string): Headers {
  const accessToken = accessAuthString ? (<AccessAuth>JSON.parse(accessAuthString)).access_token : null
  const headers = new Headers({
    'Authorization': `Bearer ${accessToken}`
  })

  return headers
}

export async function fetchData<T>(request: RequestInfo, accessAuthString?: string): Promise<T> {
  const response = await fetch(request, {
    headers: setHeaders(accessAuthString)
  })
  const data = <T>await response.json()

  return data
}

export function useSubredditPage(router: NextRouter, cookie?: Cookie) {
  const { subreddit, where, sort } = router?.query
  let listingUrl = `https://oauth.reddit.com${router.asPath}`
  const isSubPage = subreddit !== 'popular' && subreddit !== 'all'

  if (where === 'comments') {
    if (sort) {
      listingUrl = `${listingUrl}&raw_json=1`
    } else {
      listingUrl = `${listingUrl}?raw_json=1`
    }
  }

  const { data: listings } = useSWR<Listing<Thing<Link>> | [Listing<Thing<Link>>, Listing<Thing<Comment | More>>]>(
    (subreddit && cookie) ? [listingUrl, cookie?.access_auth] : null,
    fetchData
  )
  const { data: thingSubreddit } = useSWRImmutable<Thing<Subreddit>>(
    (subreddit && isSubPage && cookie) ? [`https://oauth.reddit.com/r/${subreddit}/about?raw_json=1`, cookie.access_auth] : null,
    fetchData
  )
  const { data: sidebar } = useSWR<Sidebar>(
    (subreddit && isSubPage && cookie) ? [`https://oauth.reddit.com/r/${subreddit}/api/widgets?raw_json=1`, cookie.access_auth] : null,
    fetchData
  )

  return {
    listings: listings,
    thingSubreddit: thingSubreddit,
    sidebar: sidebar
  }
}

export function parseCookie(): Cookie {
  const cookie = Object.fromEntries(document.cookie.split(/; */).map((c) => {
    const [key, ...v] = c.split('=')

    return [key, decodeURIComponent(v.join('='))]
  })) as Cookie

  return cookie
}
