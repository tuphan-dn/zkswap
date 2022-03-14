import { Row, Col, Typography, Button } from 'antd'
import IconSax from 'components/iconsax'
import ZkSwapForm from 'components/zkswapForm'

const Home = () => {
  return (
    <Row gutter={[24, 24]} className="home">
      <Col span={24}>
        <Typography.Text>Home</Typography.Text>
      </Col>
      <Col span={24}>
        <Button type="primary" icon={<IconSax name="Activity" />}>
          Test
        </Button>
      </Col>
      <Col span={24} style={{ background: '#eff2f5' }}>
        <Row gutter={[24, 24]} justify="center">
          <Col lg={8} md={12} xs={24}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <ZkSwapForm></ZkSwapForm>
              </Col>
              <Col span={24}>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Home
