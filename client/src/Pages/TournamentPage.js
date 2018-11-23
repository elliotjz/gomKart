import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import TournamentHeader from '../Components/TournamentHeader'
import TournamentData from '../Components/TournamentData'

const styles = theme => ({
  text: {
    margin: '20px'
  },
  error: {
    color: '#990000'
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
})

class TournamentPage extends Component {
  constructor(props) {
    super(props)
    this.addPlayerCallback = this.addPlayerCallback.bind(this)
    this.addRaceCallback = this.addRaceCallback.bind(this)
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

  addRaceCallback(tournament) {
    const parsedData = this.parseData(tournament)
    this.setState({
      tournament,
      parsedData,
    })
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
        <div><CircularProgress className={classes.progress} /></div> :
        <div>
        {error !== "" && <Typography className={[classes.text, classes.error]}>{error}</Typography>}
        {!tournamentExists ?
          <div>
            <Typography variant='h5' className={classes.text}>Tournament Not Found</Typography>
          </div> :
          <div>
            <TournamentHeader name={tournament.name} code={tournament.code} />
            <TournamentData
              players={players}
              parsedData={parsedData}
              addRaceCallback={this.addRaceCallback}
              addPlayerCallback={this.addPlayerCallback}
            />
          </div>
        }
        </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(TournamentPage)

