import { useRouter } from 'next/router'
import { Col } from 'react-bootstrap'

type Props = {
  i: number,
  dist: number
}

export default function Rank({ i, dist }: Props) {
  const router = useRouter()
  const { before, limit, count } = router.query
  const limitInt = limit ? parseInt(limit as string, 10) : 25
  const countInt = parseInt(count as string, 10)
  const rank = count ? (before ? (countInt - limitInt) + i : countInt + i + 1) : (limitInt - dist) + i + 1
  const width = (count ? before ? countInt - 1 : countInt + dist : limitInt).toString().length

  return (
    <Col className="d-flex align-items-center col-auto text-secondary fs-5 fw-light me-3" style={{ width: `${width}ch` }}>
      {rank <= 0 ? '📌' : rank}
    </Col>
  )
}
