import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PublicKey } from '@solana/web3.js'
import { Point } from 'helper/point'

import { TwistedElGamal } from 'helper/twistedElGamal'
import { randScalar } from 'helper/utils'

export type Mint = {
  type: 'mint'
  publicKey: PublicKey
  supply: TwistedElGamal
  s: bigint
  z: bigint
}

export type Account = {
  type: 'account'
  publicKey: PublicKey
  mint: PublicKey
  amount: TwistedElGamal
  s: bigint
  z: bigint
}

/**
 * Store constructor
 */

export type LedgerState = Record<string, Mint | Account>

const NAME = 'ledger'
const initialState: LedgerState = {}

export const initializeMint = createAsyncThunk<
  LedgerState,
  {
    mintPublicKey: PublicKey
  },
  { state: any }
>(`${NAME}/initializeMint`, async ({ mintPublicKey }) => {
  const s = randScalar()
  const z = randScalar()
  const mint: Mint = {
    type: 'mint',
    publicKey: mintPublicKey,
    supply: new TwistedElGamal(BigInt(0), s, z),
    s,
    z,
  }
  return { [mint.publicKey.toBase58()]: mint }
})

export const initializeAccount = createAsyncThunk<
  LedgerState,
  {
    mintPublicKey: PublicKey
    accountPublicKey: PublicKey
  },
  { state: any }
>(`${NAME}/initializeAccount`, async ({ mintPublicKey, accountPublicKey }) => {
  const s = randScalar()
  const z = randScalar()
  const account: Account = {
    type: 'account',
    publicKey: accountPublicKey,
    mint: mintPublicKey,
    amount: new TwistedElGamal(BigInt(0), s, z),
    s,
    z,
  }
  return { [account.publicKey.toBase58()]: account }
})

export const mintTo = createAsyncThunk<
  LedgerState,
  {
    srcAmount: TwistedElGamal
    dstAmount: TwistedElGamal
    dstPublickey: PublicKey
    mintPublicKey: PublicKey
  },
  { state: any }
>(
  `${NAME}/mintTo`,
  async (
    { srcAmount, dstAmount, dstPublickey, mintPublicKey },
    { getState },
  ) => {
    const { ledger } = getState()
    let mint = { ...ledger[mintPublicKey.toBase58()] }
    let account = { ...ledger[dstPublickey.toBase58()] }
    mint.supply = mint.supply.add(srcAmount)
    account.amount = account.amount.add(dstAmount)
    return {
      [mint.publicKey.toBase58()]: mint,
      [account.publicKey.toBase58()]: account,
    }
  },
)

export const burn = createAsyncThunk<
  LedgerState,
  {
    amount: bigint
    srcPublickey: PublicKey
    mintPublicKey: PublicKey
  },
  { state: any }
>(
  `${NAME}/burn`,
  async ({ amount, srcPublickey, mintPublicKey }, { getState }) => {
    const { ledger } = getState()
    let mint = { ...ledger[mintPublicKey.toBase58()] }
    let account = { ...ledger[srcPublickey.toBase58()] }
    const z = randScalar()
    const srcAmount = TwistedElGamal.build(
      Point.G.multiply(amount).add(Point.H.multiply(z)),
      account.acmount.P.multiply(z),
      account.acmount.P,
    )
    const dstAmount = new TwistedElGamal(amount, mint.s)
    account.amount = account.amount.subtract(srcAmount)
    mint.supply = mint.supply.subtract(dstAmount)
    return {
      [mint.publicKey.toBase58()]: mint,
      [account.publicKey.toBase58()]: account,
    }
  },
)

export const transfer = createAsyncThunk<
  LedgerState,
  {
    srcAmount: TwistedElGamal
    dstAmount: TwistedElGamal
    srcPublickey: PublicKey
    dstPublickey: PublicKey
  },
  { state: any }
>(
  `${NAME}/transfer`,
  async (
    { srcAmount, dstAmount, srcPublickey, dstPublickey },
    { getState },
  ) => {
    const { ledger } = getState()
    let src = { ...ledger[srcPublickey.toBase58()] }
    let dst = { ...ledger[dstPublickey.toBase58()] }
    if (src.mint.toBase58() !== dst.mint.toBase58())
      throw new Error(
        'The source and destination account has 2 different mints',
      )
    src.amount = src.amount.subtract(srcAmount)
    dst.amount = dst.amount.add(dstAmount)
    return {
      [src.publicKey.toBase58()]: src,
      [dst.publicKey.toBase58()]: dst,
    }
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(
        initializeMint.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        initializeAccount.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        mintTo.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        burn.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        transfer.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
