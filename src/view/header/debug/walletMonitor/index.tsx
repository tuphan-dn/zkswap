import { Card, Col, Row, Space, Typography } from 'antd'
import TokenAvatar from 'components/tokenAvatar'
import Transfer from './transfer'

import { shortenAddress } from 'helper/utils'
import { Wallet } from 'store/wallet.reducer'
import Balance from 'components/balance'

export type WalletMonitorProps = { wallet: Wallet }

const WalletMonitor = ({ wallet }: WalletMonitorProps) => {
  return (
    <Card bodyStyle={{ padding: 16 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={3}>Wallet Monitoring</Typography.Title>
        </Col>
        <Col span={24}>
          <Space direction="vertical">
            <Space>
              <Typography.Text type="secondary">Address:</Typography.Text>
              <Typography.Text copyable>
                {shortenAddress(wallet.publicKey.toBase58() || '')}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text type="secondary">Balance:</Typography.Text>
              <Typography.Text>
                <Balance publicKey={wallet.publicKey} />
              </Typography.Text>
              <TokenAvatar publicKey={wallet.mint} />
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <Transfer wallet={wallet} />
        </Col>
      </Row>
    </Card>
  )
}

export default WalletMonitor
