import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import TournamentHeader from '../Components/TournamentHeader'
import TournamentContent from '../Components/TournamentContent'
import { comparePos, compareRaces, comparePlayerScores } from '../helpers'

const styles = theme => ({
  text: {
    margin: '20px',
  },
  error: {
    color: theme.palette.error.dark,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
})

class TournamentPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: '',
      tournament: {},
      races: [],
      playerScores: [],
      loading: true,
    }
  }

  componentWillMount() {
    this.getTournamentData()
  }

  getCurrentScores(tournament) {
    if (tournament !== null) {
      const { scoreHistory } = tournament
      const currentScores = []
      for (let i = 0; i < scoreHistory.length; i++) {
        if (scoreHistory[i].active) {
          const player = scoreHistory[i].name
          if (player.charAt(0) !== '_') {
            let j = tournament.raceCounter
            let score
            while (score === undefined && j >= 0) {
              if (scoreHistory[i].scores[j]) score = scoreHistory[i].scores[j]
              j -= 1
            }
            currentScores.push([player, score.toFixed()])
          }
        }
      }
      currentScores.sort(comparePlayerScores)
      return currentScores
    }
    return 0
  }

  async getTournamentData() {
    this.setState({ loading: true })
    try {
      const params = this.props.location.search
      const res = await fetch(`/api/get-tournament-data${params}`)
      const resData = await res.json()
      const { tournament } = resData

      // get players and current scores
      const playerScores = this.getCurrentScores(tournament)

      this.setState({
        tournament,
        playerScores,
        loading: false,
        error: '',
      })
    } catch (err) {
      this.setState({
        error: 'Error loading data',
        loading: false,
      })
    }
  }

  updatedTournamentCallback = tournament => {
    const playerScores = this.getCurrentScores(tournament)
    this.setState({
      tournament,
      playerScores,
    })
  }

  updatedRacesCallback = (newRaces, page) => {
    const parsedRaces = this.parseRaces(newRaces)
    if (page && page > 1) {
      this.setState(prevState => {
        const { races } = prevState
        races.push(...parsedRaces)
        return { races }
      })
    } else {
      this.setState({
        races: parsedRaces,
      })
    }
  }

  addPlayerCallback = tournament => {
    const players = tournament.scoreHistory.map(player => player.name)
    // remove computer player
    const indexOfCompPlayer = players.indexOf('_comp')
    players.splice(indexOfCompPlayer, 1)

    // get players and current scores
    const playerScores = this.getCurrentScores(tournament)

    this.setState({
      tournament,
      playerScores,
    })
  }

  parseRaces(races) {
    for (let i = 0; i < races.length; i++) {
      const places = races[i].places[0]
      const parsedPlaces = []
      Object.keys(places).forEach(name => {
        parsedPlaces.push({
          name,
          position: places[name],
        })
      })
      parsedPlaces.sort(comparePos)
      races[i].places = parsedPlaces
    }
    return races.sort(compareRaces)
  }

  render() {
    const { classes, location } = this.props
    const { tournament, races, playerScores, loading, error } = this.state
    const tournamentExists =
      tournament !== undefined && Object.keys(tournament).length > 0

    return (
      <div>
        {loading ? (
          <div>
            <CircularProgress className={classes.progress} />
          </div>
        ) : (
          <div>
            {error !== '' && (
              <Typography className={[classes.text, classes.error]}>
                {error}
              </Typography>
            )}
            {!tournamentExists ? (
              <div>
                <Typography variant="h5" className={classes.text}>
                  Tournament Not Found
                </Typography>
              </div>
            ) : (
              <div>
                <TournamentHeader
                  name={tournament.name}
                  code={tournament.code}
                />
                <TournamentContent
                  playerScores={playerScores}
                  tournament={tournament}
                  races={races}
                  updatedTournamentCallback={this.updatedTournamentCallback}
                  updatedRacesCallback={this.updatedRacesCallback}
                  addPlayerCallback={this.addPlayerCallback}
                  location={location}
                />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

TournamentPage.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withStyles(styles)(TournamentPage)
