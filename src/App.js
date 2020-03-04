import React from 'react'
import s from './styles/App.module.scss'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Amplify from 'aws-amplify'
import amplifyConfig from './aws-exports'
import CreateRoom from './CreateRoom'
import Room from './Room'

Amplify.configure(amplifyConfig)

function App () {
  return (
    <Router>
      <div className={s.App}>
        <Switch>
          <Route path="/:id">
            <Room />
          </Route>
          <Route path="/">
            <CreateRoom />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
