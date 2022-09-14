import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import SubredditPosts from '../../../../components/SubredditPosts'
import SubredditNav from '../../../../components/SubredditNav'
import { fetchData } from '../../../../services/API'
import { Link } from '../../../../types/Link'
import { Listing } from '../../../../types/Listing'
import { Thing } from '../../../../types/Thing'
import { Subreddit } from '../../../../types/Subreddit'
import { Col, Nav, Row } from 'react-bootstrap'
import SubredditSidebar from '../../../../components/SubredditSidebar'
import NextLink from 'next/link'

type Props = {
  listingThings: Listing<Thing<Link | Comment>>
  thingSubreddit: Thing<Subreddit>
}

const SubredditWherePage: NextPage<Props> = ({ listingThings, thingSubreddit }) => {
  const router = useRouter()
  const { subreddit, where, t } = router.query
  const sorts = ['hour', 'day', 'week', 'month', 'year', 'all']

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
                :
                <>
                  {
                    (where === 'top' || where === 'controversial') &&
                    <>
                      <Nav defaultActiveKey="hot" activeKey={t as string}>
                        {
                          sorts.map((s, i) => (
                            <Nav.Item key={i}>
                              <NextLink
                                href={`/r/${subreddit}/${where}?t=${s}`}
                                passHref>
                                <Nav.Link eventKey={s}
                                  className={
                                    `nav-link fw-bold ${t === s || (!t && s === 'day')
                                      ? 'text-gray text-decoration-underline'
                                      : 'text-blue'}`
                                  }>
                                  {
                                    s === 'all'
                                      ? 'all time'
                                      : s === 'day'
                                        ? 'past 24 hours'
                                        : `past ${s}`
                                  }
                                </Nav.Link>
                              </NextLink>
                            </Nav.Item>
                          ))
                        }
                      </Nav>
                      <hr className="my-0" />
                    </>
                  }
                  <SubredditPosts listingLinks={listingThings as Listing<Thing<Link>>} />
                </>
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
