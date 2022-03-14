import { useSelector } from 'react-redux'

import { Avatar, Space, Typography } from 'antd'
import TokenName from 'components/tokenName'
import TokenAvatar from 'components/tokenAvatar'

import { AppState } from 'store'
import { PRECISION, usePrice } from 'hooks/usePrice'
import { numeric } from 'helper/utils'

export type CurrentPriceProps = {
  onClick?: (value: string) => void
}

const CurrentPrice = ({ onClick = () => {} }: CurrentPriceProps) => {
  const {
    wallet: { wallet1, wallet2 },
  } = useSelector((state: AppState) => state)

  const p = usePrice()

  return (
    <Space>
      <Typography.Text type="secondary">Current Price:</Typography.Text>
      <Typography.Link
        onClick={() => onClick(String(Number(p) / Number(PRECISION)))}
      >
        {numeric(Number(p) / Number(PRECISION)).format('0.[0000]')}
      </Typography.Link>
      <Typography.Text type="secondary">
        <TokenName publicKey={wallet2.publicKey} />
        {' / '}
        <TokenName publicKey={wallet1.publicKey} />
      </Typography.Text>
      <Avatar.Group>
        <TokenAvatar publicKey={wallet2.publicKey} />
        <TokenAvatar publicKey={wallet1.publicKey} />
      </Avatar.Group>
    </Space>
  )
}

export default CurrentPrice
