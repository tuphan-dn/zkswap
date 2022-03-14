import { AppState } from 'store'
import { useSelector } from 'react-redux'

import { Col, Row, Space, Typography } from 'antd'
import TokenSelection from 'components/tokenSelection'
import Balance from 'components/balance'
import NumericInput from 'components/numericInput'
import { useState } from 'react'

const Ask = () => {
  const { ask } = useSelector((state: AppState) => state.swap)
  const [amount, setAmout] = useState<string | number>('')

  return (
    <Row gutter={[0, 0]} align="middle">
      <Col flex="auto">
        <TokenSelection publicKey={ask.mint}></TokenSelection>
      </Col>
      <Col>
        <NumericInput
          bordered={false}
          style={{
            textAlign: 'right',
            fontSize: 24,
            maxWidth: 150,
            padding: 0,
          }}
          placeholder="0"
          value={amount}
          onChange={(value) => setAmout(value)}
        />
      </Col>
      <Col span={24}>
        <Row align="middle">
          <Col flex="auto">
            <Space className="caption">
              <Typography.Text type="secondary">Available:</Typography.Text>
              <Typography.Text type="secondary" style={{ cursor: 'pointer' }}>
                <Balance publicKey={ask.publicKey} />
              </Typography.Text>
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default Ask
