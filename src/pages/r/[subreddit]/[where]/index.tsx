import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import SubredditPosts from '../../../../components/SubredditPosts'
import SubredditNav from '../../../../components/SubredditNav'
import { fetchData } from '../../../../services/API'
import { Link } from '../../../../types/Link'
import { Listing } from '../../../../types/Listing'
import { Thing } from '../../../../types/Thing'

type Props = {
  listingThings: Listing<Thing<Link | Comment>>
}

const SubredditWherePage: NextPage<Props> = ({ listingThings }) => {
  const router = useRouter()
  const { where } = router.query

  return (
    <>
      <SubredditNav />
      {
        listingThings &&
          where === 'comments'
          ? 'comments page'
          : where === 'wiki'
            ? 'wiki page'
            : <SubredditPosts listingLinks={listingThings as Listing<Thing<Link>>} />
      }
    </>
  )
}

export default SubredditWherePage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const request = `https://oauth.reddit.com${context.resolvedUrl}`
  const cookie = context.req.cookies['access_auth']
  context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const listingThings = await fetchData<Listing<Thing<Link | Comment>>>(request, cookie)

  return {
    props: { listingThings }
  }
}
