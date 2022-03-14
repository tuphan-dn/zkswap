import { useDispatch, useSelector } from 'react-redux'
import { AppState, AppDispatch } from 'store'
import { useCallback, useEffect } from 'react'

import { Button, Col, Row } from 'antd'
import IconSax from 'components/iconsax'
import Bid from 'components/bid'
import Ask from 'components/ask'

import { Direction, setSwapWallet } from 'store/swap.reducer'

const SwapInfo = () => {
  const { wallet1, wallet2 } = useSelector((state: AppState) => state.wallet)
  const { direction } = useSelector((state: AppState) => state.swap)
  const dispatch = useDispatch<AppDispatch>()

  const swapWallet = useCallback(() => {
    if (direction === Direction.AB)
      return dispatch(
        setSwapWallet({ direction: Direction.BA, bid: wallet2, ask: wallet1 }),
      )
    else {
      return dispatch(
        setSwapWallet({ direction: Direction.AB, bid: wallet1, ask: wallet2 }),
      )
    }
  }, [direction, wallet1, wallet2, dispatch])

  useEffect(() => {
    dispatch(
      setSwapWallet({ direction: Direction.AB, bid: wallet1, ask: wallet2 }),
    )
  }, [dispatch, wallet1, wallet2])

  return (
    <Row gutter={[0, 0]} justify="center">
      <Col
        span={24}
        className="zkswap-bid"
        style={{ padding: '16px 24px 16px' }}
      >
        <Bid></Bid>
      </Col>
      <Col style={{ top: -12 }}>
        <Button
          className="btn-arrow-swap"
          size="small"
          icon={<IconSax name="ArrowSwapHorizontal" />}
          onClick={swapWallet}
        />
      </Col>
      <Col span={24} style={{ padding: '0 24px 24px' }}>
        <Ask></Ask>
      </Col>
    </Row>
  )
}

export default SwapInfo
