import type { NextPage } from 'next'
import SubredditPosts from '../../../components/SubredditPosts'
import SubredditNav from '../../../components/SubredditNav'
import { Col, Row } from 'react-bootstrap'
import SubredditSidebar from '../../../components/SubredditSidebar'

const SubredditPage: NextPage = () => {

  return (
    <>
      <SubredditNav />
      <Row>
        <Col className="pe-0">
          <SubredditPosts />
        </Col>
        <Col className="col-auto ps-0">
          <SubredditSidebar />
        </Col>
      </Row>
    </>
  )
}

export default SubredditPage
