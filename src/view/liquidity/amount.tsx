import { Row, Col, Typography, Space } from 'antd'
import TokenAvatar from 'components/tokenAvatar'
import NumericInput from 'components/numericInput'
import Balance from 'components/balance'

import { Wallet } from 'store/wallet.reducer'

export type AmountProps = {
  wallet?: Wallet
  value: string | number
  onChange: (value: string | number) => void
}

const Amount = ({ wallet, value, onChange }: AmountProps) => {
  return (
    <Row gutter={[8, 8]} justify="end">
      <Col span={24}>
        <NumericInput
          size="large"
          value={value}
          onChange={onChange}
          prefix={
            <TokenAvatar style={{ marginRight: 7 }} publicKey={wallet?.mint} />
          }
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
