import React, { Component } from 'react'
import { Chart } from 'react-google-charts'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip';



import SingleInputForm from '../Components/SingleInputForm'
import AddRaceForm from '../Components/AddRaceForm'

const options = {
  title: "Score History",
  curveType: "none",
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
  chip: {
    margin: '10px',
  },
  h4: {
    margin: '20px'
  }
}

class TournamentPage extends Component {
  constructor(props) {
    super(props)
    this.addNewPlayer = this.addNewPlayer.bind(this)
    this.addRace = this.addRace.bind(this)
    this.state = {
      error: "",
      tournament: {},
      players: []
    }
  }

  componentWillMount() {
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
          const players = tournament.scoreHistory.map((player) => (
            player.name
          ))
          const parsedData = this.parseData(tournament)
          this.setState({
            tournament,
            players,
            parsedData
          })
        }
      })
  }
 
  parseData(tournament) {
    if (tournament && tournament.length !== {}) {
      let values = [["Race"]]
      const scoreHistory = tournament.scoreHistory

      // Add a column for each race
      for (let i = 0; i <= tournament.raceCounter; i++) {
        values.push([i.toString()])
      }

      // Add scores for each player
      scoreHistory.forEach(player => {
        values[0].push(player.name)
        let lastResult = 0
        for (let i = 1; i < values.length; i++) {
          if (player.scores.hasOwnProperty(values[i][0].toString())) {
            lastResult = player.scores[values[i][0].toString()]
          }
          values[i].push(lastResult)
        }
      })
      return values
    }
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
      const parsedData = this.parseData(tournament)
      this.setState({
        tournament,
        players,
        parsedData
      })
    })
  }

  getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=')
      if (decodeURIComponent(pair[0]) === variable) {
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
    .then(tournament => {
      const parsedData = this.parseData(tournament)
      this.setState({ tournament, parsedData })
    })
  }

  render() {
    const { classes } = this.props
    const { tournament, parsedData, players } = this.state
    console.log(parsedData)
    console.log(tournament)
    const tournamentExists = tournament !== undefined && Object.keys(tournament).length > 0

    return (
      <div>
        {tournamentExists ?
          <div>
            <Typography variant="h4" className={classes.h4}>{tournament.name}</Typography>
            <Typography variant="h6">Share Code: {tournament.code}</Typography>
            <div>
              {(parsedData !== undefined && parsedData[0].length > 1) &&
                <div>
                  <div>
                    <div>
                      <Typography variant="p">Players: </Typography>
                      {players.map(player => 
                        <Chip label={player} className={classes.chip} />
                      )}
                    </div>
                  </div>
                  <div className={classes.chartContainer}>
                    <Chart
                      chartType="LineChart"
                      width="100%"
                      height="600px"
                      data={parsedData}
                      options={options}
                    />
                  </div>
                </div>
              }
            </div>
            {players.length > 0 &&
              <Paper elevation="3" className={classes.formContainer}>
                <Typography variant="h5">Add New Race</Typography>
                <AddRaceForm
                  players={this.state.players}
                  handleRaceSubmit={this.addRace}
                />
              </Paper>
            }
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
            <Typography variant='h4' className={classes.h4}>Tournament Not Found</Typography>
          </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(TournamentPage)


/*



*/