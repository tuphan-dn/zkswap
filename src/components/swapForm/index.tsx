import { Card, Row, Col } from 'antd'
import Settings from 'components/settings'
import ZkswapInfo from 'components/zkswapInfo'

const SwapForm = () => {
  return (
    <Card
      bordered={false}
      className="zkswap-card shadowed"
      bodyStyle={{ padding: 0 }}
    >
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
          <ZkswapInfo />
        </Col>
      </Row>
    </Card>
  )
}

export default SwapForm
