import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Card, Typography, Button } from 'antd'
import Amount from './amount'
import TokenAvatar from 'components/tokenAvatar'
import Balance from 'components/balance'

import { AppDispatch, AppState } from 'store'
import { PRECISION, usePrice } from 'hooks/usePrice'
import { sqrt } from 'helper/utils'
import { useAccount } from 'hooks/useAccount'
import { useMint } from 'hooks/useMint'
import { Withdrawal } from 'helper/nizk'
import { withdraw } from 'store/oracle.reducer'
import { burn, transfer } from 'store/ledger.reducer'

const RemoveLiquidity = () => {
  const [lp, setLP] = useState<string | number>('')
  const {
    oracle: { treasuryAPublicKey, treasuryBPublicKey },
    wallet: { wallet1, wallet2, lpWallet },
  } = useSelector((state: AppState) => state)
  const p = usePrice()
  const dispatch = useDispatch<AppDispatch>()

  const b = sqrt((p * BigInt(lp) * BigInt(lp)) / PRECISION)
  const a = (p * b) / PRECISION

  const dstA = useAccount(wallet1.publicKey)
  const dstB = useAccount(wallet2.publicKey)
  const srcLP = useAccount(lpWallet?.publicKey)
  const mintLP = useMint(lpWallet?.mint)
  const treasuryA = useAccount(treasuryAPublicKey)
  const treasuryB = useAccount(treasuryBPublicKey)

  const onWithdraw = useCallback(async () => {
    if (
      !a ||
      !b ||
      !dstA ||
      !dstB ||
      !srcLP ||
      !mintLP ||
      !lpWallet ||
      !treasuryA ||
      !treasuryB
    )
      return
    // Create withdrawal proof
    const withdrawalProof = Withdrawal.prove(
      a,
      b,
      dstA,
      dstB,
      srcLP,
      treasuryA.amount.P,
      treasuryB.amount.P,
      mintLP.supply.P,
    )
    await dispatch(
      withdraw({
        dstAPublicKey: dstA.publicKey,
        dstBPublicKey: dstB.publicKey,
        srcLPPublicKey: srcLP.publicKey,
        withdrawalProof,
        transfer: (args: any) => dispatch(transfer(args)),
        burn: (args: any) => dispatch(burn(args)),
      }),
    )
    return setLP('')
  }, [
    dispatch,
    a,
    b,
    dstA,
    dstB,
    srcLP,
    mintLP,
    treasuryA,
    treasuryB,
    lpWallet,
  ])

  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Remove Liquidity</Typography.Title>
        </Col>
        <Col span={24}>
          <Amount
            wallet={lpWallet}
            value={lp}
            onChange={(value) => setLP(value)}
          />
        </Col>
        <Col span={24}>
          <Card
            style={{ backgroundColor: '#fafafa' }}
            bodyStyle={{ padding: 16 }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row gutter={[8, 8]} wrap={false} align="middle">
                  <Col flex="auto">
                    <TokenAvatar publicKey={wallet1.mint} />
                  </Col>
                  <Col>
                    <Typography.Title level={3}>{Number(a)}</Typography.Title>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[8, 8]} wrap={false} align="middle">
                  <Col flex="auto">
                    <TokenAvatar publicKey={wallet2.mint} />
                  </Col>
                  <Col>
                    <Typography.Title level={3}>{Number(b)}</Typography.Title>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={[8, 8]} wrap={false} align="middle">
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
                  disabled={!lp}
                  onClick={onWithdraw}
                  block
                >
                  Withdraw
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}

export default RemoveLiquidity
