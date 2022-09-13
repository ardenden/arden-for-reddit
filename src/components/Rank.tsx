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
  const rank = count ? (before ? (countInt - (limit ? limitInt : 25)) + i : countInt + i + 1) : i + 1
  const width = (count ? before ? Number(count) - 1 : Number(count) + 25 : 25).toString().length

  return (
    <Col className="d-flex align-items-center col-auto text-secondary fs-5 fw-light me-3" style={{ width: `${width}ch` }}>
      {rank}
    </Col>
  )
}
