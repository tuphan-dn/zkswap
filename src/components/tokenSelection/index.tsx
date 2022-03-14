import { Fragment } from 'react'

import { Space, Typography } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import TokenAvatar from 'components/tokenAvatar'
import TokenName from 'components/tokenName'

const TokenSelection = ({ publicKey }: { publicKey?: any }) => {

  return (
    <Fragment>
      <Space
        style={{ boxShadow: '0 4px 40px #2124332e' }}
        className="token-select"
      >
        <TokenAvatar
          publicKey={publicKey}
          style={{ border: 'none' }}
        ></TokenAvatar>

        <Typography.Text type="secondary">
          <TokenName publicKey={publicKey} />
        </Typography.Text>
        <Typography.Text type="secondary">
          <DownOutlined style={{ fontSize: '10px' }} />
        </Typography.Text>
      </Space>
    </Fragment>
  )
}

export default TokenSelection
