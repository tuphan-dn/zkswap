import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'store'

import { Col, Radio, Row, Space, Typography } from 'antd'
import TokenSelection from 'components/tokenSelection'
import Balance from 'components/balance'
import NumericInput from 'components/numericInput'

import { setAmountWallet } from 'store/swap.reducer'

const Bid = () => {
  const { bid } = useSelector((state: AppState) => state.swap)
  const dispatch = useDispatch<AppDispatch>()

  const onChangeAmount = (value: any) => {
    dispatch(
      setAmountWallet({ type: 'bid', wallet: { ...bid, amount: value } }),
    )
  }

  return (
    <Row gutter={[0, 0]} align="middle">
      <Col flex="auto">
        <TokenSelection publicKey={bid.mint}></TokenSelection>
      </Col>
      <Col>
        <NumericInput
          bordered={false}
          style={{
            textAlign: 'right',
            fontSize: 24,
            maxWidth: 150,
            padding: 0,
          }}
          placeholder="0"
          value={bid.amount || ''}
          onChange={(value) => {
            onChangeAmount(value)
          }}
        />
      </Col>
      <Col span={24}>
        <Row align="middle">
          <Col flex="auto">
            <Space className="caption">
              <Typography.Text type="secondary">Available:</Typography.Text>
              <Typography.Text type="secondary" style={{ cursor: 'pointer' }}>
                <Balance publicKey={bid.publicKey} />
              </Typography.Text>
            </Space>
          </Col>
          <Col>
            <Radio.Group buttonStyle="solid">
              <Space>
                <Space size={4} direction="vertical">
                  <Radio.Button className="percent-btn" value={0} />
                  <Typography.Text type="secondary" className="caption">
                    50%
                  </Typography.Text>
                </Space>
                <Space size={4} direction="vertical">
                  <Radio.Button className="percent-btn" value={0} />
                  <Typography.Text type="secondary" className="caption">
                    100%
                  </Typography.Text>
                </Space>
              </Space>
            </Radio.Group>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
export default Bid
