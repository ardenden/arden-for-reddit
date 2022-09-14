import type { GetServerSideProps, NextPage } from 'next'
import SubredditPosts from '../../../components/SubredditPosts'
import SubredditNav from '../../../components/SubredditNav'
import { fetchData } from '../../../services/API'
import { Link } from '../../../types/Link'
import { Listing } from '../../../types/Listing'
import { Thing } from '../../../types/Thing'
import { Subreddit } from '../../../types/Subreddit'
import { Col, Row } from 'react-bootstrap'
import SubredditSidebar from '../../../components/SubredditSidebar'
import { Sidebar } from '../../../types/Sidebar'

type Props = {
  listingLinks: Listing<Thing<Link>>
  thingSubreddit: Thing<Subreddit>
  sidebar: Sidebar
}

const SubredditPage: NextPage<Props> = ({ listingLinks, thingSubreddit, sidebar }) => {
  return (
    <>
      <SubredditNav thingSubreddit={thingSubreddit} />
      <Row>
        <Col className="pe-0">
          <SubredditPosts listingLinks={listingLinks} />
        </Col>
        <Col className="col-auto ps-0">
          <SubredditSidebar subreddit={thingSubreddit.data} sidebar={sidebar} />
        </Col>
      </Row>
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
  let thingSubreddit: Thing<Subreddit> | undefined = undefined
  let sidebar: Sidebar | undefined = undefined
  thingSubreddit = await fetchData<Thing<Subreddit>>(`https://oauth.reddit.com/r/${subreddit}/about`, cookie)
  sidebar = await fetchData<Sidebar>(`https://oauth.reddit.com/r/${subreddit}/api/widgets`, cookie)

  return {
    props: {
      listingLinks: listingLinks,
      thingSubreddit: thingSubreddit,
      sidebar: sidebar
    }
  }
}
