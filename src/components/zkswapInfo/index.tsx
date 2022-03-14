// import { Row } from 'antd'
import { Button, Col, Row } from 'antd'
import IconSax from 'components/iconsax'
import Bid from 'components/bid'
import Ask from 'components/ask'

const ZkswapInfo = () => {
  return (
    <Row gutter={[0, 0]} justify="center">
      <Col
        span={24}
        className="zkswap-bid"
        style={{ padding: '6px 24px 16px' }}
      >
        <Bid></Bid>
      </Col>
      <Col style={{ top: -12 }}>
        <Button
          className="btn-arrow-swap"
          size="small"
          icon={<IconSax name="ArrowSwapHorizontal" />}
        />
      </Col>
      <Col span={24} style={{ padding: '0 24px 24px' }}>
        <Ask></Ask>
      </Col>
    </Row>
  )
}

export default ZkswapInfo
