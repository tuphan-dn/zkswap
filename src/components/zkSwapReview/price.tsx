import { Space, Button, Typography } from 'antd'
import IconSax from 'components/iconsax'

const Price = () => {
  return (
    <Space>
      <Button
        type="text"
        shape="circle"
        icon={<IconSax name="ArrowSwapHorizontal" />}
      />
      <Typography.Text>0</Typography.Text>
      <Typography.Text>SNTR / USDC</Typography.Text>
    </Space>
  )
}

export default Price
