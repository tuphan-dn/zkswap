import { Row, Col } from 'antd'

import ZkSwapForm from 'components/zkswapForm'
import ZkSwapReview from 'components/zkSwapReview'

const ZkSwap = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24} >
        <Row gutter={[24, 24]} justify="center">
          <Col lg={8} md={12} xs={24}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <ZkSwapForm></ZkSwapForm>
              </Col>
              <Col span={24}>
                <ZkSwapReview />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ZkSwap
