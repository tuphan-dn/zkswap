import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Card, Col, Divider, Row, Space, Typography } from 'antd'

import { AppDispatch, AppState } from 'store'
import { deposit } from 'store/oracle.reducer'
import { Deposit } from 'helper/nizk'
import { usePrice } from 'hooks/usePrice'
import { useAccount } from 'hooks/useAccount'
import { useMint } from 'hooks/useMint'
import {
  Account,
  initializeAccount,
  mintTo,
  transfer,
} from 'store/ledger.reducer'

const DEPOSIT = BigInt(10 ** 2)

const OracleMonitor = () => {
  const {
    oracle: { ra, rb },
    oracle: { treasuryAPublicKey, treasuryBPublicKey },
    wallet: { wallet1, wallet2, lpWallet },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()

  const p = usePrice()
  const srcA = useAccount(wallet1.publicKey)
  const srcB = useAccount(wallet2.publicKey)
  const dstLP = useAccount(lpWallet?.publicKey)
  const mintLP = useMint(lpWallet?.mint)

  const initSwap = useCallback(async () => {
    if (!srcA || !srcB || !dstLP || !mintLP || !lpWallet) return
    // Init treasuries
    const { [treasuryAPublicKey.toBase58()]: treasuryA } = (await dispatch(
      initializeAccount({
        mintPublicKey: srcA.mint,
        accountPublicKey: treasuryAPublicKey,
      }),
    ).unwrap()) as Record<string, Account>
    const { [treasuryBPublicKey.toBase58()]: treasuryB } = (await dispatch(
      initializeAccount({
        mintPublicKey: srcB.mint,
        accountPublicKey: treasuryBPublicKey,
      }),
    ).unwrap()) as Record<string, Account>
    // Create deposit proof
    const depositProof = Deposit.prove(
      DEPOSIT,
      DEPOSIT,
      srcA,
      srcB,
      dstLP,
      treasuryA.amount.P,
      treasuryB.amount.P,
      mintLP.supply.P,
    )
    // Deposit
    await dispatch(
      deposit({
        srcAPublicKey: srcA.publicKey,
        srcBPublicKey: srcB.publicKey,
        dstLPPublicKey: lpWallet.publicKey,
        depositProof,
        transfer: (args: any) => dispatch(transfer(args)),
        mintTo: (args: any) => dispatch(mintTo(args)),
      }),
    )
  }, [
    dispatch,
    srcA,
    srcB,
    dstLP,
    treasuryAPublicKey,
    treasuryBPublicKey,
    lpWallet,
    mintLP,
  ])

  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={3}>Oracle Monitoring</Typography.Title>
        </Col>
        <Col span={24}>
          <Space direction="vertical">
            <Space>
              <Typography.Text type="secondary">Price:</Typography.Text>
              <Typography.Text>{p.toString()}</Typography.Text>
              <Typography.Text type="secondary">
                (PRECISION = 10^9)
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text type="secondary">Reserve A:</Typography.Text>
              <Typography.Text>{ra.toString()}</Typography.Text>
              <Divider type="vertical" />
              <Typography.Text type="secondary">Reserve B:</Typography.Text>
              <Typography.Text>{rb.toString()}</Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            onClick={initSwap}
            disabled={!!ra || !!rb}
            block
          >
            Initialize a pool
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default OracleMonitor
