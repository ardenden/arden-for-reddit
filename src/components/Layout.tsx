import { ReactNode, useEffect, useState } from 'react'
import { fetchData, parseCookie } from '../services/API'
import { Cookie } from '../types/Cookie'
import { Listing } from '../types/Listing'
import { Subreddit } from '../types/Subreddit'
import { Thing } from '../types/Thing'
import Navbar from './Navbar'
import useSWRImmutable from 'swr/immutable'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const [cookie, setCookie] = useState<Cookie>()
  const { data: listingSubreddits } = useSWRImmutable<Listing<Thing<Subreddit>>>(
    cookie ? ['https://oauth.reddit.com/subreddits/default', cookie?.access_auth] : null,
    fetchData
  )

  useEffect(() => {
    if (!cookie) {
      setCookie(parseCookie())
    }
  }, [])

  return (
    <div style={{ overflowX: 'hidden' }}>
      <Navbar thingSubreddits={listingSubreddits?.data.children} />
      <main>{children}</main>
    </div>
  )
}
