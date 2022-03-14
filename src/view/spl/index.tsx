import { useSelector } from 'react-redux'

import { Row, Col, Typography } from 'antd'

import { AppState } from 'store'
import Info from './info'
import Transfer from './transfer'

const SPL = () => {
  const {
    wallet: { wallet1 },
  } = useSelector((state: AppState) => state)

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Title level={3}>SPL Testing</Typography.Title>
      </Col>
      <Col span={24}>
        <Info wallet={wallet1} />
      </Col>
      <Col span={24}>
        <Transfer />
      </Col>
    </Row>
  )
}

export default SPL
