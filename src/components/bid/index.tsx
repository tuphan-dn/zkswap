import { Col, Input, Radio, Row, Space, Typography } from 'antd'
import TokenSelection from 'components/tokenSelection'
import LogoSNTR from 'static/images/logo_sntr.png'

const Bid = () => {
  return (
    <Row gutter={[0, 0]} align="middle">
      <Col flex="auto">
        <TokenSelection url={LogoSNTR}></TokenSelection>
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
          <Col>
            <Radio.Group buttonStyle="solid">
              <Space>
                <Space size={4} direction="vertical">
                  <Radio.Button className="percent-btn" value={0} />
                  <Typography.Text type="secondary" className="caption">
                    50%
                  </Typography.Text>
                </Space>
                <Space size={4} direction="vertical">
                  <Radio.Button className="percent-btn" value={0}/>
                  <Typography.Text type="secondary" className="caption">
                    100%
                  </Typography.Text>
                </Space>
              </Space>
            </Radio.Group>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default Bid
