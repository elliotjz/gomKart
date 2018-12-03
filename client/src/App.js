import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './Pages/Home'
import LoginPage from './Pages/LoginPage'
import NewTournament from './Pages/NewTournament'
import TournamentPage from './Pages/TournamentPage'
import JoinTournament from './Pages/JoinTournament'
import NotFound from './Pages/NotFound'
import Header from './Components/Header'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      isLoggedIn: false,
      loading: true
    }
  }
  
  componentWillMount() {
    this.getUser()
  }

  async getUser() {
    try {
      const res = await fetch('/api/profile')
      const resData = await res.json()
      if (resData === undefined || resData.user === undefined) {
        this.setState({
          user: null,
          isLoggedIn: false,
          loading: false
        })
      } else {
        this.setState({
          user: resData.user,
          isLoggedIn: true,
          loading: false
        })
      }
    } catch (err) {
      this.setState({
        user: null,
        isLoggedIn: false,
        loading: false
      })
    }
  }

  render() {
    const { user, loading, isLoggedIn } = this.state
    const redirect = !loading && !isLoggedIn
    
    return (
      <BrowserRouter>
        <div className="App">
          <Header loading={loading} user={user} isLoggedIn={isLoggedIn}/>
          {loading ?
            null :
            <div>
              {redirect ?
              <Switch><Route component={LoginPage}/></Switch> :
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/tournament" component={TournamentPage} />
                <Route exact path="/new" component={NewTournament} />
                <Route exact path="/join" component={JoinTournament} />
                <Route component={NotFound}/>
              </Switch>
              }
            </div>
          }
        </div>
      </BrowserRouter>
    )
  }
}

export default App