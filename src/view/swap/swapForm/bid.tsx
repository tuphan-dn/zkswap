import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Col, Row, Space, Typography } from 'antd'
import TokenSelection from 'components/tokenSelection'
import Balance from 'components/balance'
import NumericInput from 'components/numericInput'

import { AppDispatch, AppState } from 'store'
import { Direction, setSwapWallet } from 'store/swap.reducer'
import { PRECISION, usePrice } from 'hooks/usePrice'
import { useBalance } from 'hooks/useBalance'

const Bid = () => {
  const { direction, bid, ask } = useSelector((state: AppState) => state.swap)
  const dispatch = useDispatch<AppDispatch>()

  const p = usePrice()
  const balance = useBalance(bid.publicKey)

  const onAmount = useCallback(
    (bidAmount) => {
      let askAmount: number | '' = ''
      if (bidAmount) {
        if (direction === Direction.AB)
          askAmount = Number((BigInt(bidAmount) * PRECISION) / p)
        else askAmount = Number((BigInt(bidAmount) * p) / PRECISION)
      }
      return dispatch(
        setSwapWallet({
          bid: { ...bid, amount: bidAmount },
          ask: { ...ask, amount: askAmount },
        }),
      )
    },
    [dispatch, bid, ask, direction, p],
  )

  return (
    <Row gutter={[0, 0]} align="middle">
      <Col>
        <TokenSelection publicKey={bid.mint}></TokenSelection>
      </Col>
      <Col flex="auto">
        <NumericInput
          bordered={false}
          style={{
            textAlign: 'right',
            fontSize: 24,
            padding: 0,
          }}
          placeholder="0"
          value={bid.amount}
          onChange={onAmount}
          max={balance}
        />
      </Col>
      <Col span={24}>
        <Row justify="end">
          <Col>
            <Space className="caption">
              <Typography.Text type="secondary">Available:</Typography.Text>
              <Typography.Text>
                <Balance publicKey={bid.publicKey} />
              </Typography.Text>
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default Bid
