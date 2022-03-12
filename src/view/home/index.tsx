import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Keypair } from '@solana/web3.js'

import { Row, Col, Typography, Button } from 'antd'
import IconSax from 'components/iconsax'

import { AppDispatch } from 'store'
import { initializeAccount, initializeMint } from 'store/ledger.reducer'
import { useAccount } from 'hooks/useAccount'

const mintPublicKey = new Keypair().publicKey
const accountPublicKey = new Keypair().publicKey

const Home = () => {
  const dispatch = useDispatch<AppDispatch>()

  const test = useCallback(async () => {
    await dispatch(initializeMint({ mintPublicKey }))
    await dispatch(initializeAccount({ mintPublicKey, accountPublicKey }))
  }, [dispatch])

  const account = useAccount(accountPublicKey)
  console.log(account)

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Text>Home</Typography.Text>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          icon={<IconSax name="Activity" />}
          onClick={test}
        >
          Test
        </Button>
      </Col>
    </Row>
  )
}

export default Home
