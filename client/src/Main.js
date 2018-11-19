import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import Home from './Pages/Home'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import NewTournament from './Pages/NewTournament'
import TournamentPage from './Pages/TournamentPage'
import JoinTournament from './Pages/JoinTournament'
import NotFound from './Pages/NotFound'

class Main extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/tournament" component={TournamentPage} />
          <Route exact path="/new" component={NewTournament} />
          <Route exact path="/join" component={JoinTournament} />
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Main
