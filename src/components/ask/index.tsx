import { Col, Input, Row, Space, Typography } from 'antd'
import TokenSelection from 'components/tokenSelection'
import LogoUSDT from 'static/images/logo_usdt.png'

const Ask = () => {
  return (
    <Row gutter={[0, 0]} align="middle">
      <Col flex="auto">
        <TokenSelection url={LogoUSDT}></TokenSelection>
      </Col>
      <Col>
        <Input
          bordered={false}
          style={{
            textAlign: 'right',
            fontSize: 24,
            maxWidth: 150,
            padding: 0,
          }}
          placeholder="0"
          defaultValue={3}
        />
      </Col>
      <Col span={24}>
        <Row align="middle">
          <Col flex="auto">
            <Space className="caption">
              <Typography.Text type="secondary">Available:</Typography.Text>
              <Typography.Text type="secondary" style={{ cursor: 'pointer' }}>
                0
              </Typography.Text>
              <Typography.Text type="secondary">USDC</Typography.Text>
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default Ask
