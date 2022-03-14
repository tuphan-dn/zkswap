import { Row, Col, Typography, Space } from 'antd'
import NumericInput from 'components/numericInput'
import Balance from 'components/balance'

import { Wallet } from 'store/wallet.reducer'
import { useBalance } from 'hooks/useBalance'
import TokenSelection from 'components/tokenSelection'

export type AmountProps = {
  wallet?: Wallet
  value: string | number
  onChange: (value: string | number) => void
}

const Amount = ({ wallet, value, onChange }: AmountProps) => {
  const balance = useBalance(wallet?.publicKey)

  return (
    <Row gutter={[0, 0]} justify="end">
      <Col span={24}>
        <NumericInput
          placeholder="Amount"
          size="large"
          value={value}
          onChange={onChange}
          max={balance}
          prefix={
            <TokenSelection
              style={{ marginRight: 7 }}
              publicKey={wallet?.mint}
            />
          }
          bordered={false}
        />
      </Col>
      <Col>
        <Space>
          <Typography.Text type="secondary">Available:</Typography.Text>
          <Typography.Text>
            <Balance publicKey={wallet?.publicKey} />
          </Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default Amount
