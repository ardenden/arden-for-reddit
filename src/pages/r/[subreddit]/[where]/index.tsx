import { NextPage } from 'next'
import { useRouter } from 'next/router'
import SubredditPosts from '../../../../components/SubredditPosts'
import SubredditNav from '../../../../components/SubredditNav'
import { Col, Nav, Row } from 'react-bootstrap'
import SubredditSidebar from '../../../../components/SubredditSidebar'
import NextLink from 'next/link'

const SubredditWherePage: NextPage = () => {
  const router = useRouter()
  const { subreddit, where, t } = router.query
  const sorts = ['hour', 'day', 'week', 'month', 'year', 'all']

  return (
    <>
      <SubredditNav />

      <Row>
        <Col className="pe-0">
          {
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
                  <SubredditPosts />
                </>
          }
        </Col>
        <Col className="col-auto ps-0">
          <SubredditSidebar />
        </Col>
      </Row>
    </>
  )
}

export default SubredditWherePage
