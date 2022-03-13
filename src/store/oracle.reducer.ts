import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PublicKey } from '@solana/web3.js'
import {
  Deposit,
  DepositProof,
  HybridEquality,
  HybridEqualityProof,
  Withdrawal,
  WithdrawalProof,
} from 'helper/nizk'
import { TwistedElGamal } from 'helper/twistedElGamal'
import { Account } from './ledger.reducer'

export const PRECISION = BigInt(1_000_000_000)

export type OracleState = {
  treasuryAPublicKey?: PublicKey
  treasuryBPublicKey?: PublicKey
  mintLPPublicKey?: PublicKey
  ra: bigint
  rb: bigint
}

/**
 * Store constructor
 */

const NAME = 'oracle'
const initialState: OracleState = {
  ra: BigInt(0),
  rb: BigInt(0),
}

export const setOracle = createAsyncThunk(
  `${NAME}/setOracle`,
  async (state: OracleState) => {
    return state
  },
)

export const deposit = createAsyncThunk<
  OracleState,
  {
    srcAPublicKey: PublicKey
    srcBPublicKey: PublicKey
    dstLPPublicKey: PublicKey
    depositProof: DepositProof
    transfer: any
    mintTo: any
  },
  { state: any }
>(
  `${NAME}/deposit`,
  async (
    {
      srcAPublicKey,
      srcBPublicKey,
      dstLPPublicKey,
      depositProof,
      transfer,
      mintTo,
    },
    { getState },
  ) => {
    if (!Deposit.verify(depositProof))
      throw new Error('Invalid proof of deposit')

    const {
      hashmap,
      oracle: {
        treasuryAPublicKey,
        treasuryBPublicKey,
        mintLPPublicKey,
        ra,
        rb,
      },
      ledger,
    } = getState()
    const treasuryA = ledger[treasuryAPublicKey.toBase58()] as Account
    const treasuryB = ledger[treasuryBPublicKey.toBase58()] as Account
    // Execute transactions
    const {
      srcAmountA,
      dstAmountA,
      srcAmountB,
      dstAmountB,
      srcAmountLP,
      dstAmountLP,
    } = depositProof
    transfer(srcAmountA, dstAmountA, srcAPublicKey, treasuryAPublicKey)
    transfer(srcAmountB, dstAmountB, srcBPublicKey, treasuryBPublicKey)
    mintTo(srcAmountLP, dstAmountLP, dstLPPublicKey, mintLPPublicKey)
    // Derive the internal oracle state
    const a =
      hashmap[dstAmountA.C.subtract(dstAmountA.D.multiply(treasuryA.s)).toHex()]
    const b =
      hashmap[dstAmountB.C.subtract(dstAmountB.D.multiply(treasuryB.s)).toHex()]
    if (!a || !b) throw new Error('Cannot solve the discrete log problem')
    return { ra: ra + BigInt(a), rb: rb + BigInt(b) }
  },
)

export const withdraw = createAsyncThunk<
  OracleState,
  {
    dstAPublicKey: PublicKey
    dstBPublicKey: PublicKey
    srcLPPublicKey: PublicKey
    withdrawProof: WithdrawalProof
    transfer: any
    burn: any
  },
  { state: any }
>(
  `${NAME}/withdraw`,
  async (
    {
      dstAPublicKey,
      dstBPublicKey,
      srcLPPublicKey,
      withdrawProof,
      transfer,
      burn,
    },
    { getState },
  ) => {
    if (!Withdrawal.verify(withdrawProof))
      throw new Error('Invalid proof of withdrawal')

    const {
      hashmap,
      oracle: {
        treasuryAPublicKey,
        treasuryBPublicKey,
        mintLPPublicKey,
        ra,
        rb,
      },
      ledger,
    } = getState()
    const treasuryA = ledger[treasuryAPublicKey.toBase58()] as Account
    const treasuryB = ledger[treasuryBPublicKey.toBase58()] as Account
    // Execute transactions
    const {
      srcAmountA,
      dstAmountA,
      srcAmountB,
      dstAmountB,
      srcAmountLP,
      dstAmountLP,
    } = withdrawProof
    transfer(srcAmountA, dstAmountA, treasuryAPublicKey, dstAPublicKey)
    transfer(srcAmountB, dstAmountB, treasuryBPublicKey, dstBPublicKey)
    burn(srcAmountLP, dstAmountLP, srcLPPublicKey, mintLPPublicKey)
    // Derive the internal oracle state
    const a =
      hashmap[srcAmountA.C.subtract(srcAmountA.D.multiply(treasuryA.s)).toHex()]
    const b =
      hashmap[srcAmountB.C.subtract(srcAmountB.D.multiply(treasuryB.s)).toHex()]
    if (!a || !b) throw new Error('Cannot solve the discrete log problem')
    return { ra: ra - BigInt(a), rb: rb - BigInt(b) }
  },
)

export const swapAB = createAsyncThunk<
  OracleState,
  {
    gamma: bigint
    srcPublicKey: PublicKey
    srcAmountA: TwistedElGamal
    dstAmountA: TwistedElGamal
    equalityProofA: HybridEqualityProof
    dstPublicKey: PublicKey
    srcAmountB: TwistedElGamal
    dstAmountB: TwistedElGamal
    equalityProofB: HybridEqualityProof
    transfer: any
  },
  { state: any }
>(
  `${NAME}/swapAB`,
  async (
    {
      gamma,
      srcPublicKey,
      srcAmountA,
      dstAmountA,
      equalityProofA,
      dstPublicKey,
      srcAmountB,
      dstAmountB,
      equalityProofB,
      transfer,
    },
    { getState },
  ) => {
    if (!HybridEquality.verify(dstAmountA, srcAmountA, equalityProofA))
      throw new Error('Invalid proof of amount A')
    if (!HybridEquality.verify(srcAmountB, dstAmountB, equalityProofB))
      throw new Error('Invalid proof of amount B')

    const {
      hashmap,
      oracle: { treasuryAPublicKey, treasuryBPublicKey, ra, rb },
      ledger,
    } = getState()
    const treasuryA = ledger[treasuryAPublicKey.toBase58()] as Account
    const treasuryB = ledger[treasuryBPublicKey.toBase58()] as Account
    // Execute transactions
    transfer(srcAmountA, dstAmountA, srcPublicKey, treasuryAPublicKey)
    transfer(srcAmountB, dstAmountB, treasuryBPublicKey, dstPublicKey)
    // Derive the internal oracle state
    const a =
      hashmap[dstAmountA.C.subtract(dstAmountA.D.multiply(treasuryA.s)).toHex()]
    const b =
      hashmap[srcAmountB.C.subtract(srcAmountB.D.multiply(treasuryB.s)).toHex()]
    if (!a || !b) throw new Error('Cannot solve the discrete log problem')
    return { ra: ra + BigInt(a), rb: rb - BigInt(b) }
  },
)

export const swapBA = createAsyncThunk<
  OracleState,
  {
    gamma: bigint
    srcPublicKey: PublicKey
    srcAmountB: TwistedElGamal
    dstAmountB: TwistedElGamal
    equalityProofB: HybridEqualityProof
    dstPublicKey: PublicKey
    srcAmountA: TwistedElGamal
    dstAmountA: TwistedElGamal
    equalityProofA: HybridEqualityProof
    transfer: any
  },
  { state: any }
>(
  `${NAME}/swapBA`,
  async (
    {
      gamma,
      srcPublicKey,
      srcAmountB,
      dstAmountB,
      equalityProofB,
      dstPublicKey,
      srcAmountA,
      dstAmountA,
      equalityProofA,
      transfer,
    },
    { getState },
  ) => {
    if (!HybridEquality.verify(dstAmountB, srcAmountB, equalityProofB))
      throw new Error('Invalid proof of amount B')
    if (!HybridEquality.verify(srcAmountA, dstAmountA, equalityProofA))
      throw new Error('Invalid proof of amount A')

    const {
      hashmap,
      oracle: { treasuryAPublicKey, treasuryBPublicKey, ra, rb },
      ledger,
    } = getState()
    const treasuryA = ledger[treasuryAPublicKey.toBase58()] as Account
    const treasuryB = ledger[treasuryBPublicKey.toBase58()] as Account
    // Execute transactions
    transfer(srcAmountB, dstAmountB, srcPublicKey, treasuryBPublicKey)
    transfer(srcAmountA, dstAmountA, treasuryAPublicKey, dstPublicKey)
    // Derive the internal oracle state
    const a =
      hashmap[srcAmountA.C.subtract(srcAmountA.D.multiply(treasuryA.s)).toHex()]
    const b =
      hashmap[dstAmountB.C.subtract(dstAmountB.D.multiply(treasuryB.s)).toHex()]
    if (!a || !b) throw new Error('Cannot solve the discrete log problem')
    return { ra: ra - BigInt(a), rb: rb + BigInt(b) }
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
        setOracle.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        deposit.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        withdraw.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        swapAB.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        swapBA.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer