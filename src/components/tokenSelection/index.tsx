import { Space, Typography } from 'antd'
import IconSax from 'components/iconsax'
import TokenAvatar from 'components/tokenAvatar'
import TokenName from 'components/tokenName'
import { CSSProperties } from 'react'

export type TokenSelectionProps = { publicKey?: any; style?: CSSProperties }

const TokenSelection = ({ publicKey, style }: TokenSelectionProps) => {
  return (
    <Space className="token-select shadowed" style={style}>
      <TokenAvatar publicKey={publicKey} style={{ border: 'none' }} />
      <Typography.Text type="secondary">
        <TokenName publicKey={publicKey} />
      </Typography.Text>
      <Typography.Text type="secondary">
        <IconSax variant="Bulk" name="ArrowDown2" />
      </Typography.Text>
    </Space>
  )
}

export default TokenSelection
