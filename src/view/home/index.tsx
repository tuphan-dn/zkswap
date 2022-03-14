import { useSelector } from 'react-redux'

import { Row, Col } from 'antd'
import OracleMonitor from 'view/oracleMonitor'
import WalletMonitor from 'view/walletMonitor'

import { AppState } from 'store'

const Home = () => {
  const {
    wallet: { wallet1, wallet2, lpWallet },
  } = useSelector((state: AppState) => state)

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <OracleMonitor />
      </Col>
      <Col xs={24} md={12}>
        <WalletMonitor publicKey={wallet1.publicKey} />
      </Col>
      <Col xs={24} md={12}>
        <WalletMonitor publicKey={wallet2.publicKey} />
      </Col>
      {lpWallet?.publicKey ? (
        <Col xs={24} md={12}>
          <WalletMonitor publicKey={lpWallet.publicKey} />
        </Col>
      ) : null}
    </Row>
  )
}

export default Home
