import { Avatar, Col, Modal, Row, Space, Typography } from 'antd'
import { Fragment, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import ListSelection from './listSelection'

const TokenSelection = ({ url }: { url: string }) => {
  const [visible, setVisible] = useState(false)
  return (
    <Fragment>
      <Space
        style={{ boxShadow: '0 4px 40px #2124332e' }}
        className="token-select"
        onClick={() => setVisible(true)}
      >
        <Avatar
          src={url}
          size="small"
          style={{ backgroundColor: '#2D3355', border: 'none' }}
        />

        <Typography.Text type="secondary">USDC</Typography.Text>
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
