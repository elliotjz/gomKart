import React, { Component } from 'react'
import { Chart } from 'react-google-charts'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import AddRaceForm from '../Components/AddRaceForm'
import AddPlayerForm from '../Components/AddPlayerForm'
import PlayerChips from '../Components/PlayerChips';
import { colors, getQueryVariable } from '../helpers'

const options = {
  title: "Score History",
  curveType: "none",
  legend: 'none',
  colors
}

const styles = {
  chartContainer: {
    width: "100%",
    margin: '0px auto'
  },
  addRaceContainer: {
    maxWidth: "400px",
    margin: "0px auto",
    padding: "20px",
  },
  text: {
    margin: '20px'
  },
  shareCode: {
    color: '#666',
    fontSize: '18px'
  },
  error: {
    color: '#990000'
  }
}

class TournamentPage extends Component {
  constructor(props) {
    super(props)
    this.addPlayerCallback = this.addPlayerCallback.bind(this)
    this.addRace = this.addRace.bind(this)
    this.state = {
      error: "",
      tournament: {},
      parsedData: null,
      players: [],
      loading: true,
    }
  }

  componentWillMount() {
    this.getTournamentData()
  }

  async getTournamentData() {
    this.setState({ loading: true })
    try {
      const params = this.props.location.search
      const res = await fetch(`/api/get-tournament-data${params}`)
      const resData = await res.json()
      const tournament = resData.tournament
      const players = tournament.scoreHistory.map((player) => (
        player.name
      ))
      const indexOfCompPlayer = players.indexOf("_comp")
      players.splice(indexOfCompPlayer, 1)
      const parsedData = this.parseData(tournament)
      this.setState({
        tournament,
        players,
        parsedData,
        loading: false,
        error: ""
      })
    } catch (err) {
      this.setState({
        error: "Error loading data",
        loading: false
      })
    }
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
        if (player.name !== "_comp") {
          values[0].push(player.name)
          let lastResult = 0
          for (let i = 1; i < values.length; i++) {
            if (player.scores.hasOwnProperty(values[i][0].toString())) {
              lastResult = player.scores[values[i][0].toString()]
            }
            values[i].push(lastResult)
          }
        }
      })
      return values
    }
  }

  async addRace(formData) {
    this.setState({ loading: true })
    try {
      const code = getQueryVariable('code')
      const res = await fetch('/api/add-race', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ places: formData, code })
      })
      const tournament = await res.json()
      const parsedData = this.parseData(tournament)
      this.setState({
        tournament,
        parsedData,
        loading: false,
        error: ""
      })
    } catch (err) {
      this.setState({
        error: "Error adding race",
        loading: false
      })
    }
  }

  addPlayerCallback(tournament) {
    const players = tournament.scoreHistory.map((player) => (
      player.name
    ))
    const indexOfCompPlayer = players.indexOf("_comp")
    players.splice(indexOfCompPlayer, 1)
    const parsedData = this.parseData(tournament)
    this.setState({
      tournament,
      parsedData,
      players
    })
  }

  render() {
    const { classes } = this.props
    const { tournament, parsedData, players, loading, error } = this.state
    const tournamentExists = tournament !== undefined && Object.keys(tournament).length > 0

    return (
      <div>
      {loading ?
        <div>
          <Typography variant='h5' className={classes.text}>Loading...</Typography>
        </div> :
        <div>
        {error !== "" && <Typography className={[classes.text, classes.error]}>{error}</Typography>}
        {!tournamentExists ?
          <div>
            <Typography variant='h5' className={classes.text}>Tournament Not Found</Typography>
          </div> :
          <div>
            <Typography variant="h5" className={classes.text}>{tournament.name}</Typography>
            <div>
              <Typography variant="h6" className={classes.shareCode}>
                Share Code: {tournament.code}
              </Typography>
            </div>
            <div>
              {(parsedData !== undefined && parsedData[0].length > 1) &&
                <div>
                  <PlayerChips
                    players={players}
                    parsedData={parsedData}
                    colors={colors}
                  />
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
              <Paper elevation="4" className={classes.addRaceContainer}>
                <Typography variant="h5">Add New Race</Typography>
                <AddRaceForm
                  players={this.state.players}
                  handleRaceSubmit={this.addRace}
                />
              </Paper>
            }
            <AddPlayerForm addPlayerCallback={this.addPlayerCallback} players={players}/>
          </div>
        }
        </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(TournamentPage)

