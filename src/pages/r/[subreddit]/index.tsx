import type { GetServerSideProps, NextPage } from 'next'
import SubredditPosts from '../../../components/SubredditPosts'
import SubredditNav from '../../../components/SubredditNav'
import { fetchData } from '../../../services/API'
import { Link } from '../../../types/Link'
import { Listing } from '../../../types/Listing'
import { Thing } from '../../../types/Thing'

type Props = {
  listingLinks: Listing<Thing<Link>>
}

const SubredditPage: NextPage<Props> = ({ listingLinks }) => {
  return (
    <>
      <SubredditNav />
      <SubredditPosts listingLinks={listingLinks} />
    </>
  )
}

export default SubredditPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const request = `https://oauth.reddit.com${context.resolvedUrl}`
  const cookie = context.req.cookies['access_auth']
  context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const listingLinks = await fetchData<Listing<Thing<Link>>>(request, cookie)

  return {
    props: { listingLinks }
  }
}
