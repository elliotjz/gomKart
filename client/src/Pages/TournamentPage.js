import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { Chart } from 'react-google-charts'

import SingleInputForm from '../Components/SingleInputForm'
import AddRaceForm from '../Components/AddRaceForm'

let dummyData = {
  lastRace: 11,
  playerHistory: [
  {
    "name": "EZ",
    "scoreHistory": {"1": 0,"2": 7,"3": 13,"5": 12,"6": 16,"11": 10}
  },
  {
    "name": "Martoon",
    "scoreHistory": {"1": 0,"3": 7,"4": 13,"5": 12,"9": 16,"10": 20}
  },
  {
    "name": "JLad",
    "scoreHistory": {"1": 0,"3": -4,"4": -6,"5": -8,"9": -12,"10": -12}
  },
  {
    "name": "Benton",
    "scoreHistory": {"1": 0,"2": -4,"5": -7,"6": -10,"9": -20,"11": -50}
  },
  ]
}

const options = {
  title: "Score History",
  curveType: "function",
  legend: { position: "bottom" }
}

const styles = {
  chartContainer: {
    width: "100%",
    margin: '10px auto',
  },
  formContainer: {
    maxWidth: "400px",
    margin: "30px auto",
    padding: "20px",
  },
  newPlayerBtn: {
    marginBottom: '50px',
  },
}

class TournamentPage extends Component {
  constructor(props) {
    super(props)
    this.addNewPlayer = this.addNewPlayer.bind(this)
    this.addRace = this.addRace.bind(this)
    this.state = {
      data: dummyData,
      error: "",
      tournament: {},
      players: []
    }
  }

  componentWillMount() {
    this.parseData()
    this.getTournamentData()
  }

  getTournamentData() {
    const params = this.props.location.search
    fetch(`/api/get-tournament-data${params}`)
      .then((res) => {
          if (res.status === 200) {
            return res.json()
          }
      })
      .then(data => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          const tournament = data.tournament
          console.log(tournament)
          const players = tournament.scoreHistory.map((player) => (
            player.name
          ))
          this.setState({
            tournament,
            players
          })
        }
      })
  }
 
  parseData = () => {
    let values = [["Race"]]
    let players = []

    for (let i = 0; i <= dummyData.lastRace; i++) {
      values.push([i.toString()])
    }

    dummyData.playerHistory.forEach(player => {
      players.push(player.name)
      values[0].push(player.name)
      let lastResult = 0
      for (let i = 1; i < values.length; i++) {
        if (player.scoreHistory.hasOwnProperty(values[i][0].toString())) {
          lastResult = player.scoreHistory[values[i][0].toString()]
        }
        values[i].push(lastResult)
      }
    })
    
    this.setState({ data: values, players: players })
  }

  addNewPlayer(name) {
    const code = this.getQueryVariable('code')
    fetch('/api/add-player', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, code })
    })
    .then(res => {
      if (res.status === 200) {
        return res.json()
      }
    })
    .then(tournament => {
      console.log("tournament")
      console.log(tournament)
      const players = tournament.scoreHistory.map((player) => (
        player.name
      ))
      this.setState({
        tournament,
        players
      })
    })
  }

  getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=')
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1])
      }
    }
  }

  addRace(formData) {
    const code = this.getQueryVariable('code')
    fetch('/api/add-race', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ places: formData, code })
    })
    .then(res => {
      if (res.status === 200) {
        return res.json()
      }
    })
    .then(data => {
      console.log(data)
    })
  }

  render() {
    const { classes } = this.props
    const { error,tournament } = this.state
    const scoreHistory = JSON.stringify(tournament.scoreHistory)

    return (
      <div>
        {error === "" ?
          <div>
            <div>
              <Typography variant="h4">{tournament.name}</Typography>
              <Typography variant="h6">Share Code: {tournament.code}</Typography>
              <Typography variant="h6">{scoreHistory}</Typography>
            </div>
            <Paper elevation="3" className={classes.formContainer}>
              <Typography variant="h5">Add New Race</Typography>
              <AddRaceForm
                players={this.state.players}
                handleRaceSubmit={this.addRace}
              />
            </Paper>
            <Paper elevation="3" className={classes.formContainer}>
              <Typography variant="h5">Add New Player</Typography>
              <SingleInputForm
                handleSubmit={this.addNewPlayer}
                inputLabel="Name"
                buttonLabel="Add"
              />
            </Paper>
          </div> :
          <div>
            <Typography variant='h3'>Tournament Not Found</Typography>
          </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(TournamentPage)


/*

<div className={classes.chartContainer}>
  <Chart
    chartType="LineChart"
    width="100%"
    height="600px"
    data={this.state.data}
    options={options}
  />
</div>

*/
