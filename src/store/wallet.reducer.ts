import { createSlice } from '@reduxjs/toolkit'
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

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => void builder,
})

export default slice.reducer
