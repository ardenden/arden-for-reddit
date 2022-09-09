import Link from 'next/link'
import { Nav, Navbar as BSNavbar } from 'react-bootstrap'
import { Subreddit } from '../types/Subreddit'
import { Thing } from '../types/Thing'

type Props = {
  thingSubreddits?: Thing<Subreddit>[]
}

export default function Navbar({ thingSubreddits }: Props) {
  return (
    <>
      <BSNavbar bg="light" variant="light" className="px-2">
        <Link href="/">
          <a className="navbar-brand">Arden</a>
        </Link>

        <Nav className="me-auto">
          <Link href="/r/popular">
            <a className="nav-link">popular</a>
          </Link>

          {
            thingSubreddits &&
            thingSubreddits.map((thingSubreddit, i) => (
              <Link key={i} href={thingSubreddit.data.url}>
                <a className="nav-link text-lowercase">{thingSubreddit.data.display_name}</a>
              </Link>
            ))
          }
        </Nav>
      </BSNavbar>
    </>
  )
}
