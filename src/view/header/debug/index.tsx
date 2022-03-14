import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Col, Drawer, Row } from 'antd'
import IconSax from 'components/iconsax'
import OracleMonitor from './oracleMonitor'
import WalletMonitor from './walletMonitor'

import { AppState } from 'store'

const Debug = () => {
  const [visible, setVisible] = useState(false)
  const {
    wallet: { wallet1, wallet2, lpWallet },
  } = useSelector((state: AppState) => state)

  return (
    <Fragment>
      <Button
        type="text"
        icon={<IconSax variant="Bulk" name="ShieldSearch" />}
        onClick={() => setVisible(true)}
      />
      <Drawer
        title="Debugger"
        closeIcon={<IconSax variant="Bulk" name="CloseSquare" />}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <OracleMonitor />
          </Col>
          <Col span={24}>
            <WalletMonitor wallet={wallet1} />
          </Col>
          <Col span={24}>
            <WalletMonitor wallet={wallet2} />
          </Col>
          {lpWallet ? (
            <Col span={24}>
              <WalletMonitor wallet={lpWallet} />
            </Col>
          ) : null}
        </Row>
      </Drawer>
    </Fragment>
  )
}

export default Debug
