import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'store/devTools'

import ui from './ui.reducer'
import hashmap from './hashmap.reducer'
import ledger from './ledger.reducer'
import oracle from './oracle.reducer'
import wallet from './wallet.reducer'

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools('zkswap'),
  reducer: {
    ui,
    hashmap,
    ledger,
    oracle,
    wallet,
  },
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
