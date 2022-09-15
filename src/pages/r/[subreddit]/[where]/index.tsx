import { NextPage } from 'next'
import { useRouter } from 'next/router'
import SubredditPosts from '../../../../components/SubredditPosts'
import SubredditNav from '../../../../components/SubredditNav'
import { useSubredditPage, parseCookie } from '../../../../services/API'
import { Link } from '../../../../types/Link'
import { Listing } from '../../../../types/Listing'
import { Thing } from '../../../../types/Thing'
import { Col, Nav, Row } from 'react-bootstrap'
import SubredditSidebar from '../../../../components/SubredditSidebar'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { Cookie } from '../../../../types/Cookie'

const SubredditWherePage: NextPage = () => {
  const router = useRouter()
  const { subreddit, where, t } = router.query
  const sorts = ['hour', 'day', 'week', 'month', 'year', 'all']
  const [cookie, setCookie] = useState<Cookie>()
  const { listings } = useSubredditPage(router, cookie)
  const { thingSubreddit } = useSubredditPage(router, cookie)
  const { sidebar } = useSubredditPage(router, cookie)

  useEffect(() => {
    if (!cookie) {
      setCookie(parseCookie())
    }
  }, [])

  return (
    <>
      <SubredditNav thingSubreddit={thingSubreddit} />
      <Row>
        <Col className="pe-0">
          {
            listings &&
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
                  <SubredditPosts listingLinks={listings as Listing<Thing<Link>>} />
                </>
          }
        </Col>
        <Col className="col-auto ps-0">
          <SubredditSidebar subreddit={thingSubreddit?.data} sidebar={sidebar} />
        </Col>
      </Row>
    </>
  )
}

export default SubredditWherePage
