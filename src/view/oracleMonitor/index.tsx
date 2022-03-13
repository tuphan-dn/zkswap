import { useSelector } from 'react-redux'

import { Card, Col, Divider, Row, Space, Typography } from 'antd'

import { AppState } from 'store'

const OracleMonitor = () => {
  const {
    oracle: { ra, rb },
  } = useSelector((state: AppState) => state)
  const p = !ra ? BigInt(0) : (rb * BigInt(10 ** 9)) / ra

  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={3}>Oracle Monitoring</Typography.Title>
        </Col>
        <Col span={24}>
          <Space direction="vertical">
            <Space>
              <Typography.Text type="secondary">Price:</Typography.Text>
              <Typography.Text>{p.toString()}</Typography.Text>
              <Typography.Text type="secondary">
                (PRECISION = 10^9)
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text type="secondary">Reserve A:</Typography.Text>
              <Typography.Text>{ra.toString()}</Typography.Text>
              <Divider type="vertical" />
              <Typography.Text type="secondary">Reserve B:</Typography.Text>
              <Typography.Text>{rb.toString()}</Typography.Text>
            </Space>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default OracleMonitor
