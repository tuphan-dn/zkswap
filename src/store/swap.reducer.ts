import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PublicKey } from '@solana/web3.js'
/**
 * Interface & Utility
 */

export type SwapState = {
  bid: Wallet
  ask: Wallet
}

export type Wallet = {
  publicKey?: PublicKey
  mint?: PublicKey
}

/**
 * Store constructor
 */

const NAME = 'swap'
const initialState: SwapState = {
  bid: {},
  ask: {},
}

/**
 * Actions
 */

export const setSwapWallet = createAsyncThunk(
  `${NAME}/setSwapWallet`,
  async ({ wallet1, wallet2 }: { wallet1: Wallet; wallet2: Wallet }) => {
    return { bid: wallet1, ask: wallet2 }
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
