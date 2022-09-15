import type { NextPage } from 'next'
import SubredditPosts from '../../../components/SubredditPosts'
import SubredditNav from '../../../components/SubredditNav'
import { useSubredditPage, parseCookie } from '../../../services/API'
import { Link } from '../../../types/Link'
import { Listing } from '../../../types/Listing'
import { Thing } from '../../../types/Thing'
import { Col, Row } from 'react-bootstrap'
import SubredditSidebar from '../../../components/SubredditSidebar'
import { useEffect, useState } from 'react'
import { Cookie } from '../../../types/Cookie'
import { useRouter } from 'next/router'

const SubredditPage: NextPage = () => {
  const router = useRouter()
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
          <SubredditPosts listingLinks={listings as Listing<Thing<Link>>} />
        </Col>
        <Col className="col-auto ps-0">
          <SubredditSidebar subreddit={thingSubreddit?.data} sidebar={sidebar} />
        </Col>
      </Row>
    </>
  )
}

export default SubredditPage
