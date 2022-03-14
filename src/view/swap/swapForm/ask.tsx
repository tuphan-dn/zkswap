import { useSelector } from 'react-redux'

import { Col, Row, Space, Typography } from 'antd'
import TokenSelection from 'components/tokenSelection'
import Balance from 'components/balance'
import NumericInput from 'components/numericInput'

import { AppState } from 'store'
import { useAccount } from 'hooks/useAccount'
import { useAmount } from 'hooks/useAmount'

const Ask = () => {
  const { ask } = useSelector((state: AppState) => state.swap)

  const account = useAccount(ask.publicKey)
  const amount = useAmount(account, ask.amount)

  return (
    <Row gutter={[0, 0]} align="middle">
      <Col>
        <TokenSelection publicKey={ask.mint}></TokenSelection>
      </Col>
      <Col flex="auto">
        <NumericInput
          bordered={false}
          style={{
            textAlign: 'right',
            fontSize: 24,
            padding: 0,
          }}
          placeholder="0"
          value={amount}
          readOnly
        />
      </Col>
      <Col span={24}>
        <Row justify="end">
          <Col>
            <Space className="caption">
              <Typography.Text type="secondary">Available:</Typography.Text>
              <Typography.Text>
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
