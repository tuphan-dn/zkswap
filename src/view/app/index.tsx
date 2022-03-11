import { Switch, Route, Redirect } from 'react-router-dom'

import { Layout } from 'antd'
import Home from 'view/home'
import Watcher from 'watcher'

const App = () => {
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
