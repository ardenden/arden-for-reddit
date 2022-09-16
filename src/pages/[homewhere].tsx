import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Nav } from 'react-bootstrap'
import NextLink from 'next/link'
import SubredditPosts from '../components/SubredditPosts'

const HomeWherePage: NextPage = () => {
  const router = useRouter()
  const { homewhere, t } = router.query
  const sorts = ['hour', 'day', 'week', 'month', 'year', 'all']

  return (
    <>
      {
        (homewhere === 'top' || homewhere === 'controversial') &&
        <>
          <Nav defaultActiveKey="hot" activeKey={t as string}>
            {
              sorts.map((s, i) => (
                <Nav.Item key={i}>
                  <NextLink
                    href={`${homewhere}?t=${s}`}
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
  )
}

export default HomeWherePage
