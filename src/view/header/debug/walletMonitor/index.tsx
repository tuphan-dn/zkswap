import { Card, Col, Row, Space, Typography } from 'antd'
import TokenAvatar from 'components/tokenAvatar'
import Transfer from './transfer'

import { useBalance } from 'hooks/useBalance'
import { useAccount } from 'hooks/useAccount'
import { shortenAddress } from 'helper/utils'
import { Wallet } from 'store/wallet.reducer'

export type WalletMonitorProps = { wallet: Wallet }

const WalletMonitor = ({ wallet }: WalletMonitorProps) => {
  const account = useAccount(wallet.publicKey)
  const balance = useBalance(wallet.publicKey)

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
                {shortenAddress(account?.publicKey.toBase58() || '')}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text type="secondary">Balance:</Typography.Text>
              <Typography.Text>{balance.toString()}</Typography.Text>
              <TokenAvatar publicKey={account?.mint} />
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
