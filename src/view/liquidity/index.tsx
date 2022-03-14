import { Row, Col, Tabs } from 'antd'
import AddLiquidity from './addLiquidity'
import RemoveLiquidity from './removeLiquidity'

const Liquidity = () => {
  return (
    <Row gutter={[24, 24]} justify="center">
      <Col span={12}>
        <Tabs defaultActiveKey="add-liquidity">
          <Tabs.TabPane key="add-liquidity" tab="Deposit">
            <AddLiquidity />
          </Tabs.TabPane>
          <Tabs.TabPane key="remove-liquidity" tab="Withdrawal">
            <RemoveLiquidity />
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}

export default Liquidity
