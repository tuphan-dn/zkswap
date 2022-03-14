import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Keypair, PublicKey } from '@solana/web3.js'

export type Wallet = {
  publicKey: PublicKey
  mint: PublicKey
}

/**
 * Store constructor
 */

export type WalletState = {
  wallet1: Wallet
  wallet2: Wallet
  lpWallet?: Wallet
}

const NAME = 'wallet'
const initialState: WalletState = {
  wallet1: {
    publicKey: new Keypair().publicKey,
    mint: new Keypair().publicKey,
  },
  wallet2: {
    publicKey: new Keypair().publicKey,
    mint: new Keypair().publicKey,
  },
}

export const setLPWallet = createAsyncThunk(
  `${NAME}/setLPWallet`,
  async ({ mintPublicKey }: { mintPublicKey: PublicKey }) => {
    const lpWallet: Wallet = {
      publicKey: new Keypair().publicKey,
      mint: mintPublicKey,
    }
    return { lpWallet }
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
      setLPWallet.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
