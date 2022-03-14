import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Card, Button } from 'antd'
import IconSax from 'components/iconsax'
import Bid from './bid'
import Ask from './ask'

import { AppState, AppDispatch } from 'store'
import { Direction, setSwapWallet } from 'store/swap.reducer'

const SwapForm = () => {
  const { wallet1, wallet2 } = useSelector((state: AppState) => state.wallet)
  const { direction } = useSelector((state: AppState) => state.swap)
  const dispatch = useDispatch<AppDispatch>()

  const switchToken = useCallback(() => {
    if (direction === Direction.AB)
      return dispatch(
        setSwapWallet({
          direction: Direction.BA,
          bid: { ...wallet2, amount: '' },
          ask: { ...wallet1, amount: '' },
        }),
      )
    return dispatch(
      setSwapWallet({
        direction: Direction.AB,
        bid: { ...wallet1, amount: '' },
        ask: { ...wallet2, amount: '' },
      }),
    )
  }, [direction, wallet1, wallet2, dispatch])

  useEffect(() => {
    dispatch(
      setSwapWallet({
        direction: Direction.AB,
        bid: { ...wallet1, amount: '' },
        ask: { ...wallet2, amount: '' },
      }),
    )
  }, [dispatch, wallet1, wallet2])

  return (
    <Card
      bordered={false}
      className="zkswap-card shadowed"
      bodyStyle={{ padding: 0 }}
    >
      <Row gutter={[0, 0]} justify="center">
        <Col
          span={24}
          className="zkswap-bid"
          style={{ padding: '16px 24px 16px' }}
        >
          <Bid />
        </Col>
        <Col style={{ top: -12 }}>
          <Button
            className="btn-arrow-swap"
            size="small"
            icon={<IconSax name="ArrowSwapHorizontal" />}
            onClick={switchToken}
          />
        </Col>
        <Col span={24} style={{ padding: '0 24px 24px' }}>
          <Ask />
        </Col>
      </Row>
    </Card>
  )
}

export default SwapForm
