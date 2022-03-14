import {
  Button,
  Col,
  Divider,
  Popover,
  Row,
  Tooltip,
  Typography,
  Switch,
} from 'antd'
import { SettingOutlined, WarningOutlined } from '@ant-design/icons'
import IconSax from 'components/iconsax'

const Settings = () => {
  return (
    <Row gutter={[4, 4]} justify="end" align="middle" wrap={false}>
      <Col>
        <Popover
          placement="bottomRight"
          overlayInnerStyle={{ width: 300 }}
          content={
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Typography.Title level={5}>Settings</Typography.Title>
              </Col>
              <Col span={24}>
                <Row gutter={[8, 8]}>
                  <Col flex="auto">
                    <Typography.Text type="secondary" className="caption">
                      Slippage Tolerance
                    </Typography.Text>
                  </Col>
                  <Col>
                    <Tooltip
                      placement="topLeft"
                      title="Tooltip text"
                      arrowPointAtCenter
                    >
                      <Button
                        type="text"
                        shape="circle"
                        size="small"
                        icon={<IconSax name="InfoCircle"></IconSax>}
                      ></Button>
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Col span={24}>
                  <Row gutter={[8, 8]} justify="space-between">
                    <Typography.Text>0.1%</Typography.Text>
                    <Typography.Text>0.1%</Typography.Text>
                    <Typography.Text>0.1%</Typography.Text>
                    <Typography.Text>0.1%</Typography.Text>
                    <Typography.Text type="danger">Freely</Typography.Text>
                  </Row>
                </Col>
              </Col>
              <Divider style={{ margin: 0 }} />
              <Col span={24}>
                <Row>
                  <Col flex="auto">
                    <Typography.Text>Advanced Mode</Typography.Text>
                  </Col>
                  <Col>
                    <Switch size="small" />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Typography.Paragraph className="caption">
                  <WarningOutlined />
                  &nbsp;This advanced mode will disable the automatic protection
                  that often results in bad rates and lost funds. Only use this
                  mode if you know what you are doing.
                </Typography.Paragraph>
              </Col>
              <Divider style={{ margin: 0 }} />
              <Col span={24}>
                <Row>
                  <Col flex="auto">
                    <Typography.Text>Enhancement UI</Typography.Text>
                  </Col>
                  <Col>
                    <Switch size="small" />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Typography.Paragraph  className="caption">
                  Take advantage of all the familiar tools.
                </Typography.Paragraph>
              </Col>
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
