import { AccessAuth } from '../types/AccessAuth'
import { Cookie } from '../types/Cookie'
import { Subreddit } from '../types/Subreddit'
import { Thing } from '../types/Thing'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { Widget } from '../types/Widget'
import { More } from '../types/More'
import { Listing } from '../types/Listing'
import { Link } from '../types/Link'
import { Comment } from '../types/Comment'
import { NextRouter } from 'next/router'

const OAUTH_URL = process.env.NEXT_PUBLIC_REDDIT_OAUTH_URL

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

export function useListingLinks(router: NextRouter, cookie?: Cookie) {
  const { subreddit, homewhere } = router.query
  let url = OAUTH_URL

  if (subreddit || homewhere) {
    url = `${url}${router.asPath}`
  } else {
    url = `${url}/r/popular${router.asPath}`
  }

  const { data } = useSWR<Listing<Thing<Link>>>(
    (router.isReady && cookie) ? [url, cookie?.access_auth] : null,
    fetchData
  )

  return {
    listingLinks: data
  }
}

export function usePermaLink(router: NextRouter, cookie?: Cookie) {
  const { sort } = router.query
  let url = `${OAUTH_URL}${router.asPath}`
  let postUrl = url.includes('?') ? `${url.substring(0, url.indexOf('?'))}?raw_json=1` : `${url}?raw_json=1`

  if (sort) {
    url = `${url}&raw_json=1`
  } else {
    url = `${url}?raw_json=1`
  }

  const { data: listingLinks } = useSWR<[Listing<Thing<Link>>, Listing<Thing<Comment | More>>]>(
    (router.isReady && cookie) ? [postUrl, cookie?.access_auth] : null,
    fetchData
  )
  const { data: listingReplies } = useSWR<[Listing<Thing<Link>>, Listing<Thing<Comment | More>>]>(
    (router.isReady && cookie) ? [url, cookie?.access_auth] : null,
    fetchData
  )

  return {
    listingLinks: listingLinks?.[0],
    listingReplies: listingReplies?.[1]
  }
}

export function useSubredditAbout(router: NextRouter, cookie?: Cookie) {
  const { subreddit } = router.query
  const isSubPage = subreddit !== 'popular' && subreddit !== 'all'
  const { data } = useSWRImmutable<Thing<Subreddit>>(
    (router.isReady && subreddit && isSubPage && cookie)
      ? [`${OAUTH_URL}/r/${subreddit}/about?raw_json=1`, cookie.access_auth]
      : null,
    fetchData
  )

  return {
    thingSubreddit: data
  }
}

export function useSubredditWidget(router: NextRouter, cookie?: Cookie) {
  const { subreddit } = router.query
  const isSubPage = subreddit !== 'popular' && subreddit !== 'all'
  const { data } = useSWRImmutable<Widget>(
    (router.isReady && subreddit && isSubPage && cookie)
      ? [`${OAUTH_URL}/r/${subreddit}/api/widgets?raw_json=1`, cookie.access_auth]
      : null,
    fetchData
  )

  return {
    widgets: data
  }
}

export function parseCookie(cookieString: string): Cookie {
  const cookie = Object.fromEntries(cookieString.split(/; */).map((c) => {
    const [key, ...v] = c.split('=')

    return [key, decodeURIComponent(v.join('='))]
  })) as Cookie

  return cookie
}
