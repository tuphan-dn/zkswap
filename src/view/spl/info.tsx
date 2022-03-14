import { Col, Row, Typography, Space, Card } from 'antd'
import Balance from './balance'

import { Wallet } from 'store/wallet.reducer'
import { shortenAddress } from 'helper/utils'

export type InfoProps = { wallet: Wallet }

const Info = ({ wallet }: InfoProps) => {
  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Space>
            <Typography.Title level={5} type="secondary">
              Address:
            </Typography.Title>
            <Typography.Title level={5}>
              {shortenAddress(wallet.publicKey.toBase58())}
            </Typography.Title>
          </Space>
        </Col>
        <Col span={24}>
          <Space>
            <Typography.Text type="secondary">Balance:</Typography.Text>
            <Typography.Text>
              <Balance publicKey={wallet.publicKey} />
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default Info
