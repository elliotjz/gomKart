import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import TournamentChart from '../Components/TournamentStats/TournamentChart';
import { comparePos, compareRaces, comparePlayerScores } from '../helpers';

const styles = theme => ({
  container: {
    margin: '20px',
  },
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

class ChartOnly extends Component {
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
          // Player has not been deleted from the tournament
          const player = scoreHistory[i].name
          if (player.charAt(0) !== '_') {
            // Player is not a computer
            let j = tournament.raceCounter
            let score
            let scoreChange

            // Find the current score
            while (score === undefined && j >= 0) {
              if (scoreHistory[i].scores[j]) {
                // Found the most recent score
                score = scoreHistory[i].scores[j]
                if (j === tournament.raceCounter) {
                  // Player played in most recent race
                  // So look for previous score
                  while (scoreChange === undefined && j >= 0) {
                    j -= 1
                    if (scoreHistory[i].scores[j]) {
                      // Found the previous score
                      scoreChange = score - scoreHistory[i].scores[j]
                    }
                  }
                }
              }
              j -= 1
            }

            currentScores.push([
              player,
              score.toFixed(),
              scoreChange ? scoreChange.toFixed(1) : null,
            ])
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
        error: ''
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
      <div className={classes.container}>
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
              <TournamentChart
                tournament={tournament}
                playerScores={playerScores}
              />
            )}
          </div>
        )}
      </div>
    )
  }
}

ChartOnly.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withStyles(styles)(ChartOnly)
