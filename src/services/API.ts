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
  const { subreddit } = router.query
  const { data } = useSWR<Listing<Thing<Link>>>(
    (subreddit && cookie) ? [`https://oauth.reddit.com${router.asPath}`, cookie?.access_auth] : null,
    fetchData
  )

  return {
    listingLinks: data
  }
}

export function usePermaLink(router: NextRouter, cookie?: Cookie) {
  const { subreddit, sort } = router.query
  let url = `https://oauth.reddit.com${router.asPath}`

  if (sort) {
    url = `${url}&raw_json=1`
  } else {
    url = `${url}?raw_json=1`
  }

  const { data } = useSWR<[Listing<Thing<Link>>, Listing<Thing<Comment | More>>]>(
    (subreddit && cookie) ? [url, cookie?.access_auth] : null,
    fetchData
  )

  return {
    listings: data
  }
}

export function useSubredditAbout(router: NextRouter, cookie?: Cookie) {
  const { subreddit } = router.query
  const isSubPage = subreddit !== 'popular' && subreddit !== 'all'
  const { data } = useSWRImmutable<Thing<Subreddit>>(
    (subreddit && isSubPage && cookie)
      ? [`https://oauth.reddit.com/r/${subreddit}/about?raw_json=1`, cookie.access_auth]
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
    (subreddit && isSubPage && cookie)
      ? [`https://oauth.reddit.com/r/${subreddit}/api/widgets?raw_json=1`, cookie.access_auth]
      : null,
    fetchData
  )

  return {
    widgets: data
  }
}

export function parseCookie(): Cookie {
  const cookie = Object.fromEntries(document.cookie.split(/; */).map((c) => {
    const [key, ...v] = c.split('=')

    return [key, decodeURIComponent(v.join('='))]
  })) as Cookie

  return cookie
}
