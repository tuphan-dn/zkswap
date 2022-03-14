import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Keypair, PublicKey } from '@solana/web3.js'
import { hashmap } from 'helper/hashmap'
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

export type OracleState = {
  treasuryAPublicKey: PublicKey
  treasuryBPublicKey: PublicKey
  mintLPPublicKey: PublicKey
  ra: bigint
  rb: bigint
}

/**
 * Store constructor
 */

const NAME = 'oracle'
const initialState: OracleState = {
  treasuryAPublicKey: new Keypair().publicKey,
  treasuryBPublicKey: new Keypair().publicKey,
  mintLPPublicKey: new Keypair().publicKey,
  ra: BigInt(0),
  rb: BigInt(0),
}

export const deposit = createAsyncThunk<
  Partial<OracleState>,
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
    transfer({
      srcAmount: srcAmountA,
      dstAmount: dstAmountA,
      srcPublicKey: srcAPublicKey,
      dstPublicKey: treasuryAPublicKey,
    })
    transfer({
      srcAmount: srcAmountB,
      dstAmount: dstAmountB,
      srcPublicKey: srcBPublicKey,
      dstPublicKey: treasuryBPublicKey,
    })
    mintTo({
      srcAmount: srcAmountLP,
      dstAmount: dstAmountLP,
      dstPublicKey: dstLPPublicKey,
      mintPublicKey: mintLPPublicKey,
    })
    // Derive the internal oracle state
    const a = hashmap(
      dstAmountA.C.subtract(dstAmountA.D.multiply(treasuryA.s)).toHex(),
    )
    const b = hashmap(
      dstAmountB.C.subtract(dstAmountB.D.multiply(treasuryB.s)).toHex(),
    )
    if (!a || !b) throw new Error('Cannot solve the discrete log problem')
    return { ra: ra + BigInt(a), rb: rb + BigInt(b) }
  },
)

export const withdraw = createAsyncThunk<
  Partial<OracleState>,
  {
    dstAPublicKey: PublicKey
    dstBPublicKey: PublicKey
    srcLPPublicKey: PublicKey
    withdrawalProof: WithdrawalProof
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
      withdrawalProof,
      transfer,
      burn,
    },
    { getState },
  ) => {
    if (!Withdrawal.verify(withdrawalProof))
      throw new Error('Invalid proof of withdrawal')

    const {
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
    } = withdrawalProof
    transfer({
      srcAmount: srcAmountA,
      dstAmount: dstAmountA,
      srcPublicKey: treasuryAPublicKey,
      dstPublicKey: dstAPublicKey,
    })
    transfer({
      srcAmount: srcAmountB,
      dstAmount: dstAmountB,
      srcPublicKey: treasuryBPublicKey,
      dstPublicKey: dstBPublicKey,
    })
    burn({
      srcAmount: srcAmountLP,
      dstAmount: dstAmountLP,
      srcPublicKey: srcLPPublicKey,
      mintPublicKey: mintLPPublicKey,
    })
    // Derive the internal oracle state
    const a = hashmap(
      srcAmountA.C.subtract(srcAmountA.D.multiply(treasuryA.s)).toHex(),
    )
    const b = hashmap(
      srcAmountB.C.subtract(srcAmountB.D.multiply(treasuryB.s)).toHex(),
    )
    if (!a || !b) throw new Error('Cannot solve the discrete log problem')
    return { ra: ra - BigInt(a), rb: rb - BigInt(b) }
  },
)

export const swapAB = createAsyncThunk<
  Partial<OracleState>,
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
      oracle: { treasuryAPublicKey, treasuryBPublicKey, ra, rb },
      ledger,
    } = getState()
    const treasuryA = ledger[treasuryAPublicKey.toBase58()] as Account
    const treasuryB = ledger[treasuryBPublicKey.toBase58()] as Account
    // Execute transactions
    transfer(srcAmountA, dstAmountA, srcPublicKey, treasuryAPublicKey)
    transfer(srcAmountB, dstAmountB, treasuryBPublicKey, dstPublicKey)
    // Derive the internal oracle state
    const a = hashmap(
      dstAmountA.C.subtract(dstAmountA.D.multiply(treasuryA.s)).toHex(),
    )
    const b = hashmap(
      srcAmountB.C.subtract(srcAmountB.D.multiply(treasuryB.s)).toHex(),
    )
    if (!a || !b) throw new Error('Cannot solve the discrete log problem')
    return { ra: ra + BigInt(a), rb: rb - BigInt(b) }
  },
)

export const swapBA = createAsyncThunk<
  Partial<OracleState>,
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
      oracle: { treasuryAPublicKey, treasuryBPublicKey, ra, rb },
      ledger,
    } = getState()
    const treasuryA = ledger[treasuryAPublicKey.toBase58()] as Account
    const treasuryB = ledger[treasuryBPublicKey.toBase58()] as Account
    // Execute transactions
    transfer(srcAmountB, dstAmountB, srcPublicKey, treasuryBPublicKey)
    transfer(srcAmountA, dstAmountA, treasuryAPublicKey, dstPublicKey)
    // Derive the internal oracle state
    const a = hashmap(
      srcAmountA.C.subtract(srcAmountA.D.multiply(treasuryA.s)).toHex(),
    )
    const b = hashmap(
      dstAmountB.C.subtract(dstAmountB.D.multiply(treasuryB.s)).toHex(),
    )
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
