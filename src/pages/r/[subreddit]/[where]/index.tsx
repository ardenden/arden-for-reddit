import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import SubredditPosts from '../../../../components/SubredditPosts'
import SubredditNav from '../../../../components/SubredditNav'
import { fetchData } from '../../../../services/API'
import { Link } from '../../../../types/Link'
import { Listing } from '../../../../types/Listing'
import { Thing } from '../../../../types/Thing'
import { Subreddit } from '../../../../types/Subreddit'
import { Col, Row } from 'react-bootstrap'
import SubredditSidebar from '../../../../components/SubredditSidebar'

type Props = {
  listingThings: Listing<Thing<Link | Comment>>
  thingSubreddit: Thing<Subreddit>
}

const SubredditWherePage: NextPage<Props> = ({ listingThings, thingSubreddit }) => {
  const router = useRouter()
  const { where } = router.query

  return (
    <>
      <SubredditNav thingSubreddit={thingSubreddit} />
      <Row>
        <Col className="pe-0">
          {
            listingThings &&
              where === 'comments'
              ? 'comments page'
              : where === 'wiki'
                ? 'wiki page'
                : <SubredditPosts listingLinks={listingThings as Listing<Thing<Link>>} />
          }
        </Col>
        <Col className="col-auto ps-0">
          <SubredditSidebar subreddit={thingSubreddit.data} />
        </Col>
      </Row>
    </>
  )
}

export default SubredditWherePage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { subreddit } = context.query
  const request = `https://oauth.reddit.com${context.resolvedUrl}`
  const cookie = context.req.cookies['access_auth']
  context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const listingThings = await fetchData<Listing<Thing<Link | Comment>>>(request, cookie)
  const thingSubreddit = await fetchData<Thing<Subreddit>>(`https://oauth.reddit.com/r/${subreddit}/about`, cookie)

  return {
    props: {
      listingThings: listingThings,
      thingSubreddit: thingSubreddit
    }
  }
}
