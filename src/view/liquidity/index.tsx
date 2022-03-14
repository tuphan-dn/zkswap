import { Row, Col } from 'antd'
import Deposit from './deposit'

const Liquidity = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Deposit />
      </Col>
    </Row>
  )
}

export default Liquidity
