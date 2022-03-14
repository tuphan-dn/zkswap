import { Row, Col, Card, Button, Typography, Space } from 'antd'
import IconSax from 'components/iconsax'
import Bid from './bid'
import Ask from './ask'

const SwapForm = () => {
  return (
    <Card
      bordered={false}
      className="zkswap-card card-radius shadowed"
      bodyStyle={{ padding: 0 }}
    >
      <Row gutter={[0, 0]} justify="center">
        <Col
          span={24}
          className="zkswap-bid"
          style={{ padding: '16px 24px 16px' }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Space>
                <IconSax variant="Bulk" name="PresentionChart" />
                <Typography.Title level={5}>Preview</Typography.Title>
              </Space>
            </Col>
            <Col span={24}>
              <Bid />
            </Col>
          </Row>
        </Col>
        <Col style={{ top: -12 }}>
          <Button
            className="btn-arrow-swap"
            size="small"
            icon={<IconSax name="ArrowSwapHorizontal" />}
          />
        </Col>
        <Col span={24} style={{ padding: '0 24px 24px' }}>
          <Ask />
        </Col>
      </Row>
    </Card>
  )
}

export default SwapForm
