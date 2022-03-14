import { PublicKey } from '@solana/web3.js'

import { Card, Col, Row, Space, Typography } from 'antd'

import { useBalance } from 'hooks/useBalance'
import { useAccount } from 'hooks/useAccount'
import { shortenAddress } from 'helper/utils'
import TokenAvatar from 'components/tokenAvatar'

export type WalletMonitorProps = { publicKey: PublicKey }

const WalletMonitor = ({ publicKey }: WalletMonitorProps) => {
  const account = useAccount(publicKey)
  const balance = useBalance(publicKey)

  return (
    <Card>
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
      </Row>
    </Card>
  )
}

export default WalletMonitor
