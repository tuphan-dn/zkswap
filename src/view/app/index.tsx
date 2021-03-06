import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Row, Col, Affix, Card, Layout } from 'antd'
import Header from 'view/header'
import Liquidity from 'view/liquidity'
import Swap from 'view/swap'
import Watcher from 'watcher'
import Approval from 'view/approval'

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
import { setLPWallet, Wallet } from 'store/wallet.reducer'
import configs from 'configs'

const {
  sol: { supply },
} = configs

const App = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    oracle: { mintLPPublicKey },
    wallet: { wallet1, wallet2 },
  } = useSelector((state: AppState) => state)

  const initToken = useCallback(
    async (wallet: Wallet) => {
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
          dstPublicKey: account.publicKey,
          mintPublicKey: account.mint,
        }),
      )
    },
    [dispatch],
  )

  const initLP = useCallback(async () => {
    // Init mint lp
    await dispatch(initializeMint({ mintPublicKey: mintLPPublicKey }))
    const { lpWallet } = await dispatch(
      setLPWallet({ mintPublicKey: mintLPPublicKey }),
    ).unwrap()
    // Set up lp wallet
    await dispatch(
      initializeAccount({
        mintPublicKey: lpWallet.mint,
        accountPublicKey: lpWallet.publicKey,
      }),
    )
  }, [dispatch, mintLPPublicKey])

  useEffect(() => {
    ;(async () => {
      await initToken(wallet1) // Init #1 mint and accounts
      await initToken(wallet2) // Init #2 mint and accounts
      await initLP() // Init LP mint and accounts
    })()
  }, [initToken, initLP, wallet1, wallet2])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Affix>
        <Card
          className="shadowed"
          style={{ borderRadius: '0px 0px 16px 16px' }}
          bodyStyle={{ padding: 16 }}
          bordered={false}
        >
          <Header />
        </Card>
      </Affix>
      {/* Body */}
      <Layout style={{ padding: 24 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Switch>
              <Route exact path="/liquidity" component={Liquidity} />
              <Route exact path="/swap" component={Swap} />
              <Redirect exact from="*" to="/swap" />
            </Switch>
          </Col>
        </Row>
      </Layout>
      {/* In-Background Run Jobs */}
      <Approval />
      <Watcher />
    </Layout>
  )
}

export default App
