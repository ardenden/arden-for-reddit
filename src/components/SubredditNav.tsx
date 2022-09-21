import Link from 'next/link'
import { useRouter } from 'next/router'
import { Image, Nav } from 'react-bootstrap'
import { useSubredditAbout } from '../services/API'
import { useCookie } from './CookieContext'

export default function SubredditNav() {
  const router = useRouter()
  const cookie = useCookie()
  const { subreddit, homewhere, where, linkid, linkslug } = router.query
  const subDefaults = ['hot', 'new', 'rising', 'controversial', 'top']
  const postDefaults = ['comments', 'duplicates']
  const { thingSubreddit } = useSubredditAbout(router, cookie)

  if (subreddit !== undefined && subreddit !== 'popular' && subreddit !== 'all') {
    subDefaults.push('gilded', 'wiki')
  }

  const wheres = where === 'comments' || where === 'duplicates' ? postDefaults : subDefaults

  return (
    <div className="d-flex align-items-end border-bottom border-primary fw-bold gap-2 px-2"
      style={{ background: '#d0e4f4', height: '60px' }}>
      {
        (thingSubreddit && thingSubreddit.data) &&
        (thingSubreddit.data.header_img
          ? <Image src={thingSubreddit.data.header_img} height="60" className="me-2" style={{ maxWidth: '175px' }} />
          : thingSubreddit.data.icon_img &&
          <Image src={thingSubreddit.data.icon_img} height="60" className="me-2" style={{ maxWidth: '175px' }} />)
      }

      <Link href={subreddit ? `/r/${subreddit}` : '/'}>
        <a className="text-dark fs-5">{subreddit ? subreddit : 'arden for reddit'}</a>
      </Link>

      <Nav variant="tabs" className="border-0 d-flex gap-2 px-2 lh-sm">
        {
          wheres.map((w, i) => (
            <Nav.Item key={i}>
              <Link href={
                w === 'comments' || w === 'duplicates'
                  ? `/r/${subreddit}/${w}/${linkid}/${linkslug}`
                  : !subreddit
                    ? `${w === 'hot' ? '/' : `/${w}`}`
                    : `/r/${subreddit}${w === 'hot' ? '' : `/${w}`}`
              } passHref>
                <Nav.Link className={`nav-link fw-bold py-1 px-2 ${!subreddit
                  ? homewhere === w || (!homewhere && w === 'hot')
                    ? 'border-primary border-bottom-0 text-orange bg-white active-where'
                    : 'text-blue'
                  : where === w || (!where && w === 'hot')
                    ? 'border-primary border-bottom-0 text-orange bg-white active-where'
                    : 'text-blue'
                  }`}>
                  {w === 'duplicates' ? 'other discussions' : w}
                </Nav.Link>
              </Link>
            </Nav.Item>
          ))
        }
      </Nav>
    </div >
  )
}
