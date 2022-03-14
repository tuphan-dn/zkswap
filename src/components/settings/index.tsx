import { Button, Col, Divider, Popover, Row, Typography } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

const Settings = () => {
  return (
    <Row gutter={[4, 4]} justify="end" align="middle" wrap={false}>
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
