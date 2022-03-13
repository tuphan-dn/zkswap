import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col, Card, Typography } from 'antd'
import TokenAvatar from 'components/tokenAvatar'

import { AppState } from 'store'
import NumericInput from 'components/numericInput'
import { usePrice } from 'hooks/usePrice'

const Deposit = () => {
  const {
    wallet: { wallet1, wallet2 },
  } = useSelector((state: AppState) => state)
  const [a, setA] = useState<string | number>('')
  const [b, setB] = useState<string | number>('')

  const p = usePrice()

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} md={12}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Typography.Title level={5}>Deposit</Typography.Title>
            </Col>
            <Col span={24}>
              <NumericInput
                value={a}
                onChange={(value) => setA(value)}
                prefix={
                  <TokenAvatar
                    style={{ marginLeft: -7 }}
                    publicKey={wallet1.mint}
                  />
                }
              />
            </Col>
            <Col span={24}>
              <NumericInput
                value={b}
                onChange={(value) => setB(value)}
                prefix={
                  <TokenAvatar
                    style={{ marginLeft: -7 }}
                    publicKey={wallet2.mint}
                  />
                }
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default Deposit
