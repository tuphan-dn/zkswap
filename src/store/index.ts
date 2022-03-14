import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'store/devTools'

import ui from './ui.reducer'
import ledger from './ledger.reducer'
import oracle from './oracle.reducer'
import wallet from './wallet.reducer'
import swap from './swap.reducer'

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools('zkswap'),
  reducer: {
    ui,
    ledger,
    oracle,
    wallet,
    swap,
  },
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
