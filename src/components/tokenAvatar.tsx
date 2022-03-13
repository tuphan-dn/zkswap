import { PublicKey } from '@solana/web3.js'

import { Avatar } from 'antd'

const COLORS = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']

export type TokenAvatarProps = {
  publicKey?: PublicKey
  size?: number
}

const TokenAvatar = ({ publicKey, size = 24 }: TokenAvatarProps) => {
  const tokenName = publicKey?.toBase58().substring(0, 2) || '??'
  const index = (publicKey?.toBuffer()[0] || 0) % COLORS.length
  return (
    <Avatar style={{ backgroundColor: COLORS[index] }} size={size}>
      {tokenName}
    </Avatar>
  )
}

export default TokenAvatar
