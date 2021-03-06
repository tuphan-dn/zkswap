import { ChangeEvent, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Keypair, PublicKey } from '@solana/web3.js'

import { Row, Col, Input, Space, Button, Divider, Typography } from 'antd'
import IconSax from 'components/iconsax'
import Balance from 'components/balance'
import NumericInput from 'components/numericInput'

import { AppDispatch, AppState } from 'store'
import { Account, initializeAccount, transfer } from 'store/ledger.reducer'
import { TwistedElGamal } from 'helper/twistedElGamal'
import { Point } from 'helper/point'
import { randScalar } from 'helper/utils'
import { Wallet } from 'store/wallet.reducer'
import { useBalance } from 'hooks/useBalance'

export type TransferProps = { wallet: Wallet }

const Transfer = ({ wallet }: TransferProps) => {
  const [amount, setAmount] = useState<string | number>('')
  const [dstAddress, setDstAddress] = useState(
    new Keypair().publicKey.toBase58(),
  )
  const dispatch = useDispatch<AppDispatch>()
  const { ledger } = useSelector((state: AppState) => state)

  const balance = useBalance(wallet.publicKey)

  const getAccount = useCallback(
    async (publicKey: PublicKey) => {
      const acc = { ...ledger[publicKey.toBase58()] }
      if (acc.type === 'account') return acc
      const { [publicKey.toBase58()]: re } = (await dispatch(
        initializeAccount({
          mintPublicKey: wallet.mint,
          accountPublicKey: publicKey,
        }),
      ).unwrap()) as Record<string, Account>
      return re
    },
    [dispatch, ledger, wallet],
  )

  const onSend = useCallback(async () => {
    if (!amount) return
    const src = await getAccount(wallet.publicKey)
    const dst = await getAccount(new PublicKey(dstAddress))
    const m = BigInt(amount)
    const z = randScalar()
    await dispatch(
      transfer({
        srcAmount: new TwistedElGamal(m, src.s),
        dstAmount: TwistedElGamal.build(
          Point.G.multiply(m).add(Point.H.multiply(z)),
          dst.amount.P.multiply(z),
          dst.amount.P,
        ),
        srcPublicKey: src.publicKey,
        dstPublicKey: dst.publicKey,
      }),
    ).unwrap()
    return setAmount('')
  }, [amount, dispatch, wallet, dstAddress, getAccount])

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Typography.Text type="secondary">Transfer Test</Typography.Text>
      </Col>
      <Col span={24}>
        <Input
          value={dstAddress}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDstAddress(e.target.value || '')
          }
          prefix={
            <Space>
              <Balance publicKey={new PublicKey(dstAddress)} />
              <Divider type="vertical" />
            </Space>
          }
          suffix={
            <Button
              type="text"
              icon={<IconSax name="Shuffle" />}
              onClick={() => setDstAddress(new Keypair().publicKey.toBase58())}
              style={{ marginRight: -7 }}
            />
          }
        />
      </Col>
      <Col span={24}>
        <NumericInput
          placeholder="Amount"
          onChange={(value) => setAmount(value)}
          value={amount}
          max={balance}
          suffix={
            <Button
              type="text"
              icon={<IconSax name="Send" />}
              onClick={onSend}
              disabled={!amount}
              style={{ marginRight: -7 }}
            />
          }
        />
      </Col>
    </Row>
  )
}

export default Transfer
