import { Col, Row, Typography } from 'antd'
import Balance from './balance'

import { Wallet } from 'store/wallet.reducer'

export type InfoProps = { wallet: Wallet }

const Info = ({ wallet }: InfoProps) => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Title level={5}>
          {wallet.publicKey.toBase58()}
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Text>
          <Balance publicKey={wallet.publicKey} />
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default Info
