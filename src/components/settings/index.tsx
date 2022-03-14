import {
  Avatar,
  Button,
  Col,
  Divider,
  Popover,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import { SettingOutlined } from '@ant-design/icons'

import LogoSen from 'static/images/logo_sen.svg'

const Settings = () => {
  return (
    <Row gutter={[4, 4]} justify="end" align="middle" wrap={false}>
      <Col>
        <Space size={4} style={{ cursor: 'pointer' }}>
          <Typography.Text style={{ fontSize: 12, color: '#7A7B85' }}>
            Powered by
          </Typography.Text>
          <Tooltip title="Sentre Protocol">
            <Avatar src={LogoSen} size={20} />
          </Tooltip>
        </Space>
      </Col>
      <Col>
        <Divider type="vertical" style={{ padding: 0 }} />
      </Col>
      <Col>
        <Popover
          placement="bottomRight"
          overlayInnerStyle={{ width: 300 }}
          content={
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Typography.Title level={5}>Settings</Typography.Title>
              </Col>
              <Col span={24}>Slippage</Col>
              <Divider style={{ margin: 0 }} />
              <Col span={24}>Advanced</Col>
              <Divider style={{ margin: 0 }} />
              <Col span={24}>Enhancement</Col>
            </Row>
          }
          trigger="click"
        >
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<SettingOutlined />}
          ></Button>
        </Popover>
      </Col>
    </Row>
  )
}

export default Settings
