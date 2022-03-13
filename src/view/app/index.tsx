import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Row, Col, Affix, Card, Layout } from 'antd'
import Header from 'view/header'
import Home from 'view/home'
import SPL from 'view/spl'
import Watcher from 'watcher'

import { AppDispatch, AppState } from 'store'
import {
  Account,
  initializeAccount,
  initializeMint,
  mintTo,
} from 'store/ledger.reducer'
import { TwistedElGamal } from 'helper/twistedElGamal'
import { Point } from 'helper/point'
import { randScalar } from 'helper/utils'
import { Wallet } from 'store/wallet.reducer'

const App = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { wallet1, wallet2 },
  } = useSelector((state: AppState) => state)

  const initMint = useCallback(
    async (wallet: Wallet) => {
      const supply = BigInt(10 ** 3)
      const z = randScalar()
      // Init a mint
      const { [wallet.mint.toBase58()]: mint } = await dispatch(
        initializeMint({ mintPublicKey: wallet.mint }),
      ).unwrap()
      // Init an account
      const { [wallet.publicKey.toBase58()]: account } = (await dispatch(
        initializeAccount({
          mintPublicKey: wallet.mint,
          accountPublicKey: wallet.publicKey,
        }),
      ).unwrap()) as Record<string, Account>
      // Mint supply to the account
      await dispatch(
        mintTo({
          srcAmount: new TwistedElGamal(supply, mint.s),
          dstAmount: TwistedElGamal.build(
            Point.G.multiply(supply).add(Point.H.multiply(z)),
            account.amount.P.multiply(z),
            account.amount.P,
          ),
          dstPublickey: account.publicKey,
          mintPublicKey: account.mint,
        }),
      )
    },
    [dispatch],
  )

  useEffect(() => {
    initMint(wallet1) // Init #1 mint and accounts
    initMint(wallet2) // Init #2 mint and accounts
  }, [initMint, wallet1, wallet2])

  return (
    <Layout>
      {/* Header */}
      <Affix>
        <Card
          style={{ borderRadius: '0px 0px 16px 16px' }}
          bodyStyle={{ padding: 16 }}
          bordered={false}
        >
          <Header />
        </Card>
      </Affix>
      {/* Body */}
      <Layout style={{ padding: 16 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Switch>
              <Route exact path="/home" component={Home} />
              <Route exact path="/spl" component={SPL} />
              <Redirect exact from="*" to="/home" />
            </Switch>
          </Col>
        </Row>
      </Layout>
      <Watcher />
    </Layout>
  )
}

export default App
