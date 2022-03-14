import { Fragment, useState } from 'react'

import { Col, Modal, Row, Space, Typography } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import ListSelection from './listSelection'
import TokenAvatar from 'components/tokenAvatar'
import TokenName from 'components/tokenName'

const TokenSelection = ({ publicKey }: { publicKey?: any }) => {
  const [visible, setVisible] = useState(false)

  return (
    <Fragment>
      <Space
        style={{ boxShadow: '0 4px 40px #2124332e' }}
        className="token-select"
        onClick={() => setVisible(true)}
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
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose={true}
        centered={true}
        bodyStyle={{ background: '#f4f4f5', borderRadius: '16px' }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24} />
          <Col span={24}>
            <ListSelection />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default TokenSelection
