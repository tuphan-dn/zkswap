// Bugfix performance
// https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#excessive-use-of-memory-and-cpu
export const devTools = (appName: string): any => {
  if (process.env.REACT_APP_ENV !== 'development') return false
  return {
    name: appName,
    actionSanitizer: ({ payload, type }: { payload: any; type: string }) => ({
      payload,
      type,
    }),
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString() // https://github.com/GoogleChromeLabs/jsbi/issues/30
}

export const bigintSerializationMiddleware = {
  serializableCheck: {
    isSerializable: () => true,
  },
}
