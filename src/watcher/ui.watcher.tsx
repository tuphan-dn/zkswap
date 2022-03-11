import { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'store'
import { resize } from 'store/ui.reducer'

const UIWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()

  // Listen window events
  useEffect(() => {
    window.onresize = () => dispatch(resize())
  }, [dispatch])

  return <Fragment />
}

export default UIWatcher
