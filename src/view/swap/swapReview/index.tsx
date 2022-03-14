import { Card, Row, Col, Typography, Button } from 'antd'
import Price from './price'
import Review from './review'

const SwapReview = () => {
  return (
    <Card bordered={false} className="zkswap-card shadowed">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Review & Swap</Typography.Title>
        </Col>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Review title={'Price impact'} value={'0%'} color={'#14E041'} />
            <Review title={'Price'} value={<Price />} />
          </Row>
        </Col>
        <Col span={24}>
          <Button type="primary" disabled={true} block>
            Swap
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default SwapReview
