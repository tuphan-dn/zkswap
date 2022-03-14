import { Row, Col, Typography, Divider, Input, Card, Space, Avatar } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const ListSelection = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Token Selection</Typography.Title>
      </Col>
      <Col span={24}>
        <Divider style={{ margin: 0 }} />
      </Col>
      <Col span={24}>
        <Card className="search" bodyStyle={{ padding: 0 }} bordered={false}>
          <Input
            placeholder="Search"
            suffix={<SearchOutlined />}
            size="large"
            bordered={false}
          />
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} style={{ height: 300 }} className="scrollbar">
          <Col span={24}>
            <Card className="search" bodyStyle={{ padding: 0 }}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Space className="token-select" style={{ padding: '8px' }}>
                    <Avatar
                      src={
                        'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3SghkPdBSrpF9bzdAy5LwR4nGgFbqNcC6ZSq8vtZdj91/logo.png'
                      }
                      style={{ backgroundColor: '#2D3355', border: 'none' }}
                    />

                    <Typography.Text>USDC</Typography.Text>
                    <Divider type="vertical" style={{ margin: 0 }} />
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: '12px' }}
                    >
                      EveryOne Coin
                    </Typography.Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ListSelection
