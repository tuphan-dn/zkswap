import { Card, Row, Col } from 'antd'
import SwapInfo from 'view/swap/swapInfo'

const SwapForm = () => {
  return (
    <Card
      bordered={false}
      className="zkswap-card shadowed"
      bodyStyle={{ padding: 0 }}
    >
      <Row>
        <Col span={24}>
          <SwapInfo />
        </Col>
      </Row>
    </Card>
  )
}

export default SwapForm
