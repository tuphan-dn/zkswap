import { Card, Row, Col } from 'antd'
import Settings from 'components/settings'
import SwapInfo from 'components/swapInfo'

const SwapForm = () => {
  return (
    <Card bordered={false} className="zkswap-card" bodyStyle={{ padding: 0 }}>
      <Row>
        <Col span={24} className="zkswap-setting">
          <Row>
            <Col flex="auto" />
            <Col>
              <Settings />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <SwapInfo />
        </Col>
      </Row>
    </Card>
  )
}

export default SwapForm
