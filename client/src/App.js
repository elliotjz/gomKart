import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import Home from './Pages/Home'
import LoginPage from './Pages/LoginPage'
import NewTournament from './Pages/NewTournament'
import TournamentPage from './Pages/TournamentPage'
import JoinTournament from './Pages/JoinTournament'
import NotFound from './Pages/NotFound'
import Header from './Components/Header'

import './App.css'

const gomKartTheme = createMuiTheme({
  palette: {
    common: {
      black: '#000',
      white: '#fff',
      grey: '#A9A9A9',
      success: '#a7efa7',
      successLight: '#cdf4cd',
    },
    background: {
      paper: '#fff',
      default: '#fafafa',
    },
    primary: {
      light: '#E4EDEF',
      main: 'rgba(65, 148, 165, 1)',
      dark: 'rgba(0, 59, 71, 1)',
      contrastText: '#fff',
    },
    secondary: {
      light: 'rgba(248, 206, 207, 1)',
      main: 'rgba(218, 50, 52, 1)',
      dark: 'rgba(141, 1, 5, 1)',
      contrastText: '#fff',
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    useNextVariants: true,
  },
})

/*
#CAEBF2
#A9A9A9
#FF3B3F
#EFEFEF
*/

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      isLoggedIn: false,
      loading: true,
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
          loading: false,
        })
      } else {
        this.setState({
          user: resData.user,
          isLoggedIn: true,
          loading: false,
        })
      }
    } catch (err) {
      this.setState({
        user: null,
        isLoggedIn: false,
        loading: false,
      })
    }
  }

  render() {
    const { user, loading, isLoggedIn } = this.state
    const redirect = !loading && !isLoggedIn

    return (
      <MuiThemeProvider theme={gomKartTheme}>
        <BrowserRouter>
          <div className="App">
            <Header loading={loading} user={user} isLoggedIn={isLoggedIn} />
            {loading ? null : (
              <div>
                {redirect ? (
                  <Switch>
                    <Route component={LoginPage} />
                  </Switch>
                ) : (
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route
                      exact
                      path="/tournament"
                      component={TournamentPage}
                    />
                    <Route exact path="/new" component={NewTournament} />
                    <Route exact path="/join" component={JoinTournament} />
                    <Route component={NotFound} />
                  </Switch>
                )}
              </div>
            )}
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    )
  }
}

export default App
