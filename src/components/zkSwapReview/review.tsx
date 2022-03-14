import { Col, Row, Typography } from 'antd'

const Review = ({
  title,
  value,
  color,
}: {
  title: string
  value: any
  color?: string 
}) => {
  return (
    <Col span={24}>
      <Row align="middle">
        <Col flex="auto">
          <Typography.Text type="secondary">{title}</Typography.Text>
        </Col>
        <Col>
          <span style={{ color: color || '' }}>{value}</span>
        </Col>
      </Row>
    </Col>
  )
}

export default Review
