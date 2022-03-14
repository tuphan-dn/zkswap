import { useHistory, useLocation } from 'react-router-dom'

import { Row, Col, Space, Button, Typography } from 'antd'
import IconSax from 'components/iconsax'
import Debug from './debug'

export type NavigationProps = { name: string; to: string }

export const Navigation = ({ name, to }: NavigationProps) => {
  const histoty = useHistory()
  const { pathname } = useLocation()
  return (
    <Button
      type={pathname.startsWith(to) ? 'primary' : 'text'}
      onClick={() => histoty.push(to)}
    >
      {name}
    </Button>
  )
}

const Header = () => {
  return (
    <Row gutter={[24, 24]} wrap={false} align="middle">
      <Col flex="auto">
        <Space style={{ color: '#FF8A65' }}>
          <IconSax variant="Bulk" name="Shield" style={{ fontSize: 32 }} />
          <Typography.Title level={5} style={{ color: 'inherit' }}>
            zkSwap
          </Typography.Title>
        </Space>
      </Col>
      <Col>
        <Space>
          <Navigation name="Swap" to="/swap" />
          <Navigation name="Liquidity" to="/liquidity" />
          <Debug />
        </Space>
      </Col>
    </Row>
  )
}

export default Header
