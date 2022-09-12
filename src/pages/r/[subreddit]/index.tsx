import type { GetServerSideProps, NextPage } from 'next'
import SubredditPosts from '../../../components/SubredditPosts'
import SubredditNav from '../../../components/SubredditNav'
import { fetchData } from '../../../services/API'
import { Link } from '../../../types/Link'
import { Listing } from '../../../types/Listing'
import { Thing } from '../../../types/Thing'
import { Subreddit } from '../../../types/Subreddit'

type Props = {
  listingLinks: Listing<Thing<Link>>
  thingSubreddit: Thing<Subreddit>
}

const SubredditPage: NextPage<Props> = ({ listingLinks, thingSubreddit }) => {
  return (
    <>
      <SubredditNav thingSubreddit={thingSubreddit} />
      <SubredditPosts listingLinks={listingLinks} />
    </>
  )
}

export default SubredditPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { subreddit } = context.query
  const request = `https://oauth.reddit.com${context.resolvedUrl}`
  const cookie = context.req.cookies['access_auth']
  context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const listingLinks = await fetchData<Listing<Thing<Link>>>(request, cookie)
  const thingSubreddit = await fetchData<Thing<Subreddit>>(`https://oauth.reddit.com/r/${subreddit}/about`, cookie)

  return {
    props: {
      listingLinks: listingLinks,
      thingSubreddit: thingSubreddit
    }
  }
}
