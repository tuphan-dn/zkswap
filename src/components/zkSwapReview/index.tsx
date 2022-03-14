import { Card, Row, Col, Typography } from 'antd'
import Price from './price'
import Review from './review'

const ZkSwapReview = () => {
  return (
    <Card bordered={false} className="zkswap-card">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Review & Swap</Typography.Title>
        </Col>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Review
              title={'Price impact'}
              value={'0%'}
              color={'#14E041'}
            ></Review>
            <Review title={'Price'} value={<Price></Price>}></Review>
            <Review title={'Slippage Tolerance'} value={'100%'}></Review>
            <Review title={'Route'} value={''}></Review>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default ZkSwapReview
