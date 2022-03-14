import { PublicKey } from '@solana/web3.js'

import { Avatar } from 'antd'
import { CSSProperties } from 'react'

const COLORS = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']

export type TokenAvatarProps = {
  style?: CSSProperties
  publicKey?: PublicKey
  size?: number
}

const TokenAvatar = ({
  style = {},
  publicKey,
  size = 24,
}: TokenAvatarProps) => {
  const tokenName = publicKey?.toBase58().substring(0, 2) || '??'
  const index = (publicKey?.toBuffer()[0] || 0) % COLORS.length
  return (
    <Avatar style={{ backgroundColor: COLORS[index], ...style }} size={size}>
      {tokenName}
    </Avatar>
  )
}

export default TokenAvatar
