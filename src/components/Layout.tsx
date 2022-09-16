import { ReactNode, useContext } from 'react'
import { fetchData } from '../services/API'
import { Listing } from '../types/Listing'
import { Subreddit } from '../types/Subreddit'
import { Thing } from '../types/Thing'
import Navbar from './Navbar'
import useSWRImmutable from 'swr/immutable'
import SubredditNav from './SubredditNav'
import SubredditSidebar from './SubredditSidebar'
import { CookieContext } from './CookieContext'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const cookie = useContext(CookieContext)
  const { data: listingSubreddits } = useSWRImmutable<Listing<Thing<Subreddit>>>(
    cookie ? ['https://oauth.reddit.com/subreddits/default', cookie?.access_auth] : null,
    fetchData
  )

  return (
    <div style={{ overflowX: 'hidden' }}>
      <Navbar thingSubreddits={listingSubreddits?.data.children} />
      <SubredditNav />
      <div className="float-end">
        <SubredditSidebar />
      </div>
      <main>{children}</main>
    </div>
  )
}
