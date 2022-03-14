import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Card, Typography, Button } from 'antd'
import Amount from './amount'
import Balance from 'components/balance'

import { AppDispatch, AppState } from 'store'
import { deposit } from 'store/oracle.reducer'
import { useAccount } from 'hooks/useAccount'
import { useMint } from 'hooks/useMint'
import { Deposit } from 'helper/nizk'
import { mintTo, transfer } from 'store/ledger.reducer'
import { sqrt } from 'helper/utils'

const AddLiquidity = () => {
  const {
    oracle: { treasuryAPublicKey, treasuryBPublicKey },
    wallet: { wallet1, wallet2, lpWallet },
  } = useSelector((state: AppState) => state)
  const [a, setA] = useState<string | number>('')
  const [b, setB] = useState<string | number>('')
  const [lp, setLP] = useState(0)
  const dispatch = useDispatch<AppDispatch>()

  const srcA = useAccount(wallet1.publicKey)
  const srcB = useAccount(wallet2.publicKey)
  const dstLP = useAccount(lpWallet?.publicKey)
  const mintLP = useMint(lpWallet?.mint)
  const treasuryA = useAccount(treasuryAPublicKey)
  const treasuryB = useAccount(treasuryBPublicKey)

  const onDeposit = useCallback(async () => {
    if (
      !a ||
      !b ||
      !srcA ||
      !srcB ||
      !dstLP ||
      !mintLP ||
      !lpWallet ||
      !treasuryA ||
      !treasuryB
    )
      return
    // Create deposit proof
    const depositProof = Deposit.prove(
      BigInt(a),
      BigInt(b),
      srcA,
      srcB,
      dstLP,
      treasuryA.amount.P,
      treasuryB.amount.P,
      mintLP.supply.P,
    )
    await dispatch(
      deposit({
        srcAPublicKey: srcA.publicKey,
        srcBPublicKey: srcB.publicKey,
        dstLPPublicKey: dstLP.publicKey,
        depositProof,
        transfer: (args: any) => dispatch(transfer(args)),
        mintTo: (args: any) => dispatch(mintTo(args)),
      }),
    )
    setA('')
    setB('')
  }, [
    a,
    b,
    dstLP,
    lpWallet,
    mintLP,
    srcA,
    srcB,
    treasuryA,
    treasuryB,
    dispatch,
  ])

  useEffect(() => {
    if (!a || !b) return setLP(0)
    return setLP(Number(sqrt(BigInt(a) * BigInt(b))))
  }, [a, b])

  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Add Liquidity</Typography.Title>
        </Col>
        <Col span={24}>
          <Amount
            wallet={wallet1}
            value={a}
            onChange={(value) => setA(value)}
          />
        </Col>
        <Col span={24}>
          <Amount
            wallet={wallet2}
            value={b}
            onChange={(value) => setB(value)}
          />
        </Col>
        <Col span={24}>
          <Card
            style={{ backgroundColor: '#fafafa' }}
            bodyStyle={{ padding: 16 }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row gutter={[8, 8]} wrap={false}>
                  <Col flex="auto">
                    <Typography.Title level={3} type="secondary">
                      LP
                    </Typography.Title>
                  </Col>
                  <Col>
                    <Typography.Title level={3}>{lp}</Typography.Title>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[8, 8]} wrap={false}>
                  <Col flex="auto">
                    <Typography.Text type="secondary">
                      Your Current LP
                    </Typography.Text>
                  </Col>
                  <Col>
                    <Typography.Text>
                      <Balance publicKey={lpWallet?.publicKey} />
                    </Typography.Text>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Button
                  type="primary"
                  disabled={!a || !b}
                  onClick={onDeposit}
                  block
                >
                  Deposit
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}

export default AddLiquidity
