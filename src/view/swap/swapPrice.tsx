import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Card, Input, Typography, Space, Button } from 'antd'

import { PRECISION, usePrice } from 'hooks/usePrice'
import { numeric } from 'helper/utils'
import { useOracle } from 'hooks/useOracle'
import { AppDispatch, AppState } from 'store'
import { useAccount } from 'hooks/useAccount'
import { Direction, setSwapWallet } from 'store/swap.reducer'
import { swapAB, swapBA } from 'store/oracle.reducer'
import { transfer } from 'store/ledger.reducer'
import TokenName from 'components/tokenName'

const computeGamma = (curPrice: bigint, newPrice: bigint) => {
  if (!curPrice || !newPrice || curPrice === newPrice)
    return {
      gamma: BigInt(0),
      reverted: false,
    }
  if (curPrice < newPrice)
    return {
      gamma: (curPrice * PRECISION) / newPrice,
      reverted: true,
    }
  return {
    gamma: (newPrice * PRECISION) / curPrice,
    reverted: false,
  }
}

const impactColor = (impact: number) => {
  let color = '#FA8C16'
  if (impact > 0) color = '#14E041'
  if (impact < 0) color = '#D72311'
  return color
}

const SwapPrice = () => {
  const [price, setPrice] = useState('')
  const {
    swap: { bid, ask },
    wallet: { wallet1, wallet2 },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()

  const p = usePrice()
  const src = useAccount(bid.publicKey)
  const dst = useAccount(ask.publicKey)
  const { gamma, reverted } = computeGamma(
    p,
    BigInt(Number(price) * Number(PRECISION) || 0),
  )
  const productConstantProof = useOracle(gamma, src?.amount.P, dst?.amount.P)

  const impact =
    !price || !p
      ? 0
      : (Number(price) * Number(PRECISION) - Number(p)) / Number(p)

  const onSwap = useCallback(async () => {
    if (!bid.publicKey || !ask.publicKey || !productConstantProof) return
    const swap = !reverted ? swapAB : swapBA
    await dispatch(
      swap({
        srcPublicKey: bid.publicKey,
        dstPublicKey: ask.publicKey,
        productConstantProof,
        transfer: (args: any) => dispatch(transfer(args)),
      }),
    )
    return setPrice('')
  }, [dispatch, reverted, bid.publicKey, ask.publicKey, productConstantProof])

  useEffect(() => {
    if (!reverted)
      dispatch(
        setSwapWallet({
          direction: Direction.AB,
          bid: { ...wallet1, amount: productConstantProof?.srcBidAmount },
          ask: { ...wallet2, amount: productConstantProof?.dstAskAmount },
        }),
      )
    else
      dispatch(
        setSwapWallet({
          direction: Direction.BA,
          bid: { ...wallet2, amount: productConstantProof?.srcBidAmount },
          ask: { ...wallet1, amount: productConstantProof?.dstAskAmount },
        }),
      )
  }, [dispatch, reverted, wallet1, wallet2, productConstantProof])

  return (
    <Card className="card-radius shadowed">
      <Row gutter={[24, 24]} align="middle">
        <Col>
          <Space direction="vertical" size={0} style={{ fontSize: 12 }}>
            <Typography.Text type="secondary">
              Cur. Price:{' '}
              <Typography.Link
                onClick={() => setPrice(String(Number(p) / Number(PRECISION)))}
              >
                {numeric(Number(p) / Number(PRECISION)).format('0.[0000]')}
              </Typography.Link>{' '}
              <TokenName publicKey={wallet2.publicKey} />
              {' / '}
              <TokenName publicKey={wallet1.publicKey} />
            </Typography.Text>
            <Typography.Text type="secondary">
              Imp. Price:{' '}
              <span style={{ color: impactColor(impact) }}>
                {numeric(Math.abs(impact) * 100).format('0.[0000]')}%
              </span>
            </Typography.Text>
          </Space>
        </Col>
        <Col flex="auto">
          <Input
            bordered={false}
            style={{
              textAlign: 'right',
              fontSize: 20,
              padding: 0,
            }}
            placeholder="New Price"
            value={price}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value
              setPrice(value)
            }}
          />
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={onSwap} block>
            Swap
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default SwapPrice
