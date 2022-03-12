import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Layout } from 'antd'
import Home from 'view/home'
import Watcher from 'watcher'

import { AppDispatch } from 'store'
import { loadHashmap } from 'store/hashmap.reducer'

const App = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(loadHashmap())
  }, [dispatch])

  return (
    <Layout>
      <Layout style={{ padding: 16 }}>
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
