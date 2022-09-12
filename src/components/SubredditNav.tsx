import Link from 'next/link'
import { useRouter } from 'next/router'
import { Image, Nav } from 'react-bootstrap'
import { Subreddit } from '../types/Subreddit'
import { Thing } from '../types/Thing'

type Props = {
  thingSubreddit: Thing<Subreddit>
}

export default function SubredditNav({ thingSubreddit }: Props) {
  const router = useRouter()
  const { subreddit, where } = router.query
  const wheres = where === 'comments' ? ['comments'] : ['hot', 'new', 'top', 'wiki']

  return (
    <div className="d-flex align-items-end border-bottom border-primary fw-bold gap-2 px-2"
      style={{ background: '#d0e4f4' }}>
      {
        (thingSubreddit && thingSubreddit.data) &&
        (thingSubreddit.data.header_img
          ? <Image src={thingSubreddit.data.header_img} height="60" className="me-2" />
          : thingSubreddit.data.icon_img &&
          <Image src={thingSubreddit.data.icon_img} height="60" className="me-2" />)
      }
      <Link href={`/r/${subreddit}`}>
        <a className="text-dark fs-5 me-2">{subreddit}</a>
      </Link>

      <Nav variant="tabs" defaultActiveKey="hot" activeKey={where as string}
        className="border-0 d-flex gap-2 px-2 lh-sm mt-4">
        {
          wheres.map((w, i) => (
            <Nav.Item key={i}>
              <Link href={w === 'comments' ? router.asPath : `/r/${subreddit}${w === 'hot' ? '' : `/${w}`}`} passHref>
                <Nav.Link eventKey={w}
                  className={`nav-link fw-bold bg-light ${where === w || (!where && w === 'hot')
                    ? 'border-primary border-bottom-0 text-orange bg-white'
                    : 'text-blue'
                    }`}>
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
