import { Row, Col } from 'antd'
import SwapForm from 'view/swap/swapForm'
import SwapPrice from 'view/swap/swapPrice'

const Swap = () => {
  return (
    <Row gutter={[24, 24]} justify="center">
      <Col lg={8} md={12} xs={24}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <SwapPrice />
          </Col>
          <Col span={24}>
            <SwapForm />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Swap
