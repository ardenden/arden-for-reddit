import { useRouter } from 'next/router'
import { Col } from 'react-bootstrap'

type Props = {
  i: number
}

export default function Rank({ i }: Props) {
  const router = useRouter()
  const { before, limit, count } = router.query
  const limitInt = parseInt(limit as string, 10)
  const countInt = parseInt(count as string, 10)

  return (
    <Col className="d-flex align-items-center col-auto text-secondary fs-5 fw-light">
      {count ? (before ? (countInt - (limit ? limitInt : 25)) + i : countInt + i + 1) : i + 1}
    </Col>
  )
}
