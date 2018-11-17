import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import ChartPage from './Pages/ChartPage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'

class Main extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={LoginPage}/>
          <Route exact path="/register" component={RegisterPage}/>
          <Route exact path="/" component={ChartPage}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Main
