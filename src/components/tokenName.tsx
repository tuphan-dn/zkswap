import { PublicKey } from '@solana/web3.js'

export type TokenNameProps = {
  publicKey?: PublicKey
}

const TokenName = ({ publicKey }: TokenNameProps) => {
  const tokenName = publicKey?.toBase58().substring(0, 2) || '??'
  return <span>{tokenName}</span>
}

export default TokenName
