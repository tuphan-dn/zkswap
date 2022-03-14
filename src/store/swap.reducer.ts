import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PublicKey } from '@solana/web3.js'

/**
 * Interface & Utility
 */

export type SwapState = {
  direction: Direction
  bid: Wallet
  ask: Wallet
}

export type Wallet = {
  publicKey?: PublicKey
  mint?: PublicKey
  amount: number | ''
}

export enum Direction {
  AB,
  BA,
}

/**
 * Store constructor
 */

const NAME = 'swap'
const initialState: SwapState = {
  direction: Direction.AB,
  bid: {
    amount: '',
  },
  ask: {
    amount: '',
  },
}

/**
 * Actions
 */

export const setSwapWallet = createAsyncThunk(
  `${NAME}/setSwapWallet`,
  async (state: Partial<SwapState>) => {
    return state
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
    void builder.addCase(
      setSwapWallet.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
