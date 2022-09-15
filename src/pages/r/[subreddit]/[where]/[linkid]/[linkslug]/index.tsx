import { NextPage } from 'next'
import { Col, Row } from 'react-bootstrap'
import SubredditNav from '../../../../../../components/SubredditNav'
import SubredditSidebar from '../../../../../../components/SubredditSidebar'
import Permalink from '../../../../../../components/Permalink'

const PostPermalinkPage: NextPage = () => {
  return (
    <>
      <SubredditNav />
      <Row>
        <Col className="pe-0">
          <Permalink />
        </Col>
        <Col className="col-auto ps-0">
          <SubredditSidebar />
        </Col>
      </Row>
    </>
  )
}

export default PostPermalinkPage
