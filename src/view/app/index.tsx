import { useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { Layout } from 'antd'
import Home from 'view/home'
import Watcher from 'watcher'

import { AppDispatch } from 'store'
import { loadHashMap } from 'store/hashmap.reducer'

const App = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(loadHashMap())
  }, [dispatch])

  return (
    <Layout className="root-bg">
      <Layout style={{ padding: '72px 16px 16px' }}>
        <Switch>
          <Route exact path="/home" component={Home} />
          <Redirect exact from="*" to="/home" />
        </Switch>
      </Layout>
      <Watcher />
    </Layout>
  )
}

export default App
