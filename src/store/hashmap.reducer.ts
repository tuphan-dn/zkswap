import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type HashmapState = Record<string, number>

/**
 * Store constructor
 */

const NAME = 'hashmap'
const initialState: HashmapState = {}
const LOOP = 2 ** 16
const COUNTER = 2 ** 0

export const loadHashmap = createAsyncThunk(`${NAME}/loadHashmap`, async () => {
  let hashmap = {}
  for (let i = 0; i < COUNTER; i++) {
    const name = `hashmap_${i * LOOP}_${(i + 1) * LOOP}.json`
    const data = require('static/hashmap/' + name)
    hashmap = { ...hashmap, ...data }
  }
  return hashmap
})

export const findHashmap = createAsyncThunk<
  HashmapState,
  string,
  { state: any }
>(`${NAME}/findHashmap`, async (hash, { getState }) => {
  let { hashmap } = getState()
  return hashmap[hash]
})

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
        loadHashmap.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        findHashmap.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
