import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Space, Button, Typography } from 'antd'
import IconSax from 'components/iconsax'
import TokenName from 'components/tokenName'

import { AppState } from 'store'
import { PRECISION, usePrice } from 'hooks/usePrice'

const Price = () => {
  const [inverse, setInverse] = useState(false)
  const { bid, ask } = useSelector((state: AppState) => state.swap)
  const p = usePrice()

  const price = Number(p) / Number(PRECISION)
  const inversePrice = 1 / price

  return (
    <Space>
      <Button
        type="text"
        shape="circle"
        icon={<IconSax name="ArrowSwapHorizontal" />}
        onClick={() => setInverse(!inverse)}
      />
      <Typography.Text>{inverse ? price : inversePrice}</Typography.Text>
      {inverse ? (
        <Typography.Text>
          <TokenName publicKey={ask.publicKey} />
          {' / '}
          <TokenName publicKey={bid.publicKey} />
        </Typography.Text>
      ) : (
        <Typography.Text>
          <TokenName publicKey={bid.publicKey} />
          {' / '}
          <TokenName publicKey={ask.publicKey} />
        </Typography.Text>
      )}
    </Space>
  )
}

export default Price
