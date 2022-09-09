import Link from 'next/link'
import { useRouter } from 'next/router'
import { Nav } from 'react-bootstrap'

export default function SubredditNav() {
  const router = useRouter()
  const { subreddit, where } = router.query
  const wheres = where === 'comments' ? ['comments'] : ['hot', 'new', 'top', 'wiki']

  return (
    <div className="d-flex align-items-center border-bottom fw-bold">
      <Link href={`/r/${subreddit}`}>
        <a className="text-decoration-none text-dark fs-5 me-2">{subreddit}</a>
      </Link>

      <Nav variant="tabs" defaultActiveKey="hot" activeKey={where as string} className="border-0">
        {
          wheres.map((w, i) => (
            <Nav.Item key={i}>
              <Link href={w === 'comments' ? router.asPath : `/r/${subreddit}${w === 'hot' ? '' : `/${w}`}`} passHref>
                <Nav.Link eventKey={w}
                  className={`nav-link fw-bold ${where === w || (!where && w === 'hot') ? 'text-orange' : 'text-blue'}`}>
                  {w}
                </Nav.Link>
              </Link>
            </Nav.Item>
          ))
        }
      </Nav>
    </div >
  )
}
