import React, { Component } from 'react'
import { Chart } from 'react-google-charts'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip';

import SingleInputForm from '../Components/SingleInputForm'
import AddRaceForm from '../Components/AddRaceForm'

const fakeTournamentData = {
  adminUsers: [ 'elliot.zoerner@gmail.com',
    'joshuasemail48@yahoo.com.au',
    'jacobddrandell@gmail.com'
  ],
  scoreHistory:
  [ { name: '_comp', scores: { '0': -200,
      '1': -188.92053880805383,
      '2': -163.41595379083992,
      '3': -124.46898620325874,
      '4': -107.44643229521228,
      '5': -69.14186846055134,
      '6': -29.242054396231136,
      '7': 6.003446656366909,
      '8': 30.820124195355323,
      '9': 38.67434167277177,
      '10': 64.56580156420412 } },
    { name: 'EZ', scores: { '0': 200,
      '1': 198.48013470201343,
      '2': 201.9804978135031,
      '3': 200.27081723332753,
      '4': 204.56493173494394,
      '5': 207.83196221145752,
      '6': 207.1564127884877,
      '7': 214.5591057227798,
      '8': 222.62473671547636,
      '9': 217.653583490472,
      '10': 227.89739427558231 } },
    { name: 'Josh', scores: { '0': 200,
      '1': 208.48013470201343,
      '2': 216.4275855269646,
      '3': 223.90285622920277,
      '4': 216.76554688513204,
      '5': 224.28486752594614,
      '6': 224.28486752594614,
      '7': 224.28486752594614,
      '8': 224.28486752594614,
      '9': 234.17855093785542,
      '10': 234.17855093785542 } },
    { name: 'Jake', scores: { '0': 200,
      '1': 203.48013470201343,
      '2': 203.48013470201343,
      '3': 203.48013470201343,
      '4': 212.57487124805414,
      '5': 212.57487124805414,
      '6': 221.57568475909332,
      '7': 221.57568475909332,
      '8': 221.57568475909332,
      '9': 221.57568475909332,
      '10': 231.44020208701608 } },
    { name: 'Jordy', scores: { '0': 200,
      '1': 200,
      '2': 183.4157196432014,
      '3': 162.79111221325397,
      '4': 139.51701660162115,
      '5': 112.26458634554983,
      '6': 99.16919972566339,
      '7': 86.02428055221175,
      '8': 71.87853851841555,
      '9': 71.87853851841555,
      '10': 62.432814853769614 } },
    { name: 'Ash', scores: { '0': 200,
      '1': 178.48013470201343,
      '2': 158.1120161051573,
      '3': 134.02406582546104,
      '4': 134.02406582546104,
      '5': 112.18558112954379,
      '6': 112.18558112954379,
      '7': 82.68230631610527,
      '8': 63.94573981821648,
      '9': 51.16899215389512,
      '10': 51.16899215389512 } },
    { name: 'Andre', scores: { '0': 200,
      '6': 164.87030846749687,
      '7': 164.87030846749687,
      '8': 164.87030846749687,
      '9': 164.87030846749687,
      '10': 128.31624412767735 } } ],
  _id: '5bf57cc994f9c93fefcb51d1',
  name: 'GOM',
  code: '4B3RXM0Q7R',
  raceCounter: 10,
  __v: 0
}

const colors = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#DD4477',
  '#3B3EAC',
  '#0099C6',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC'
]

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
  formContainer: {
    maxWidth: "400px",
    margin: "30px auto",
    padding: "20px",
  },
  chip: {
    margin: '20px 8px 0px 8px',
    borderWidth: '3px',
    borderStyle: 'solid'
  },
  h4: {
    margin: '20px'
  },
  shareCode: {
    display: 'inline',
  },
  grey: {
    color: '#666',
    fontSize: '18px'
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
      parsedData: null,
      players: [],
      loading: true
    }
  }

  componentWillMount() {
    this.getTournamentData()
  }

  getTournamentData() {
    this.setState({ loading: true })
    const params = this.props.location.search
    fetch(`/api/get-tournament-data${params}`)
      .then((res) => {
          if (res.status === 200) {
            return res.json()
          }
      })
      .then(data => {
        if (!data || data.error) {
          this.setState({
            error: data ? data.error : "Error loading data",
            loading: false
          })
        } else {
          const tournament = data.tournament
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
            loading: false
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

  getCurrentScores() {
    const { players, parsedData } = this.state
    if (parsedData !== null) {
      let currentScores = {}
      for (let i = 0; i < players.length; i++) {
        const player = players[i]
        const index = parsedData[0].indexOf(player)
        const score = parsedData[parsedData.length - 1][index]
        currentScores[player] = score.toFixed(0)
      }
      return currentScores
    } else {
      return 0
    }
  }

  addNewPlayer(name) {
    this.setState({ loading: true })
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
      const indexOfCompPlayer = players.indexOf("_comp")
      players.splice(indexOfCompPlayer, 1)
      const parsedData = this.parseData(tournament)
      this.setState({
        tournament,
        players,
        parsedData,
        loading: false
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
    this.setState({ loading: true })
    const code = this.getQueryVariable('code')
    fetch('/api/add-race', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ places: formData, code })
    })
    .then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        this.setState({ loading: false })
      }
    })
    .then(tournament => {
      const parsedData = this.parseData(tournament)
      this.setState({
        tournament,
        parsedData,
        loading: false
      })
    })
  }

  render() {
    const { classes } = this.props
    const { tournament, parsedData, players, loading } = this.state
    const tournamentExists = tournament !== undefined && Object.keys(tournament).length > 0
    const currentScores = this.getCurrentScores()

    return (
      <div>
      {loading ?
        <div>
          <Typography variant='h4' className={classes.h4}>Loading...</Typography>
        </div> :
        <div>
        {!tournamentExists ?
          <div>
            <Typography variant='h4' className={classes.h4}>Tournament Not Found</Typography>
          </div> :
          <div>
            <Typography variant="h4" className={classes.h4}>{tournament.name}</Typography>
            <div>
              <Typography variant="h6" className={[classes.shareCode, classes.grey]}>Share Code: </Typography>
              <Typography variant="h6" className={classes.shareCode}>{tournament.code}</Typography>
            </div>
            <div>
              {(parsedData !== undefined && parsedData[0].length > 1) &&
                <div>
                  <div>
                    <div>
                      {players.map((player, index) => 
                        <Chip
                          label={`${player}: ${currentScores[player]}`}
                          className={classes.chip}
                          style={{borderColor: colors[index]}}
                        />
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
          </div>
        }
        </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(TournamentPage)


/*



*/