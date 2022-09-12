import { Row } from 'react-bootstrap'
import { Link } from '../types/Link'
import { Listing } from '../types/Listing'
import { Thing } from '../types/Thing'
import Paginate from './Paginate'
import Post from './Post'
import Rank from './Rank'

type Props = {
  listingLinks: Listing<Thing<Link>>
}

export default function SubredditPosts({ listingLinks }: Props) {
  return (
    <>
      {
        listingLinks &&
        <div className="border-top-0 pt-3 pb-2 px-2 mb-2">
          {
            listingLinks.data.children.map((thingLink, i) => (
              <div key={i}>
                <Row className="lh-sm px-2">
                  <Rank i={i} />
                  <Post link={thingLink.data} />
                </Row>
                <hr />
              </div>
            ))
          }

          <div className="px-2">
            <Paginate listBefore={listingLinks.data.before} listAfter={listingLinks.data.after} />
          </div>
        </div>
      }
    </>
  )
}
