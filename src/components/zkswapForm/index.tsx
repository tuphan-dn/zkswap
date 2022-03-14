import { Card, Row, Col } from 'antd'
import Settings from 'components/settings'
import ZkswapInfo from 'components/zkswapInfo'

const ZkSwapForm = () => {
  return (
    <Card bordered={false} className="zkswap-card" bodyStyle={{ padding: 0 }}>
      <Row gutter={0}>
        <Col span={24} className="zkswap-setting">
          <Row>
            <Col flex="auto"></Col>
            <Col>
              <Settings></Settings>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <ZkswapInfo></ZkswapInfo>
        </Col>
      </Row>
    </Card>
  )
}

export default ZkSwapForm
