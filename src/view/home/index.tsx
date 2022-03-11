import { Row, Col, Typography, Button } from 'antd'

const Home = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Text>Home</Typography.Text>
      </Col>
      <Col span={24}>
        <Button type="primary">Test</Button>
      </Col>
    </Row>
  )
}

export default Home
