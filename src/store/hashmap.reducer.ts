import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import hashmap from 'configs/data/hashmap_0_1048576.json'

export type HashMapState = string[]

/**
 * Store constructor
 */

const NAME = 'hashmap'
const initialState: HashMapState = []

/**
 * Actions
 */

export const loadHashMap = createAsyncThunk(`${NAME}/loadHashMap`, async () => {
  return hashmap
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      loadHashMap.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
