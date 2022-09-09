import { ReactNode, useEffect, useState } from 'react'
import { fetchData, parseCookie } from '../services/API'
import { Cookie } from '../types/Cookie'
import { Listing } from '../types/Listing'
import { Subreddit } from '../types/Subreddit'
import { Thing } from '../types/Thing'
import Navbar from './Navbar'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const [cookie, setCookie] = useState<Cookie>()
  const [thingSubreddits, setThingSubreddits] = useState<Thing<Subreddit>[]>()

  async function getSubreddits() {
    const subreddits = await fetchData<Listing<Thing<Subreddit>>>(
      'https://oauth.reddit.com/subreddits/default',
      cookie?.access_auth
    )
    setThingSubreddits(subreddits.data.children)
  }

  useEffect(() => {
    if (!cookie) {
      setCookie(parseCookie())
    }
  }, [])

  useEffect(() => {
    if (cookie) {
      getSubreddits()
    }
  }, [cookie])

  return (
    <>
      <Navbar thingSubreddits={thingSubreddits} />
      <main>{children}</main>
    </>
  )
}
