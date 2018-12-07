import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Minimize from '@material-ui/icons/Minimize'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import PlayerResultForm from './PlayerResultForm'
import { getQueryVariable } from '../helpers'

const formDataReset = {
  player0: '',
  player0Pos: '',
  player1: '',
  player1Pos: '',
  player2: '',
  player2Pos: '',
  player3: '',
  player3Pos: '',
  player4: '',
  player4Pos: '',
  player5: '',
  player5Pos: '',
  player6: '',
  player6Pos: '',
  player7: '',
  player7Pos: '',
  player8: '',
  player8Pos: '',
  player9: '',
  player9Pos: '',
  player10: '',
  player10Pos: '',
  player11: '',
  player11Pos: '',
}

const styles = theme => ({
  root: {
    display: 'block',
  },
  addRaceContainer: {
    maxWidth: '400px',
    margin: '0px auto',
    padding: '20px',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    width: '40px',
    height: '40px',
    margin: '0 5px',
  },
  buttonContainer: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
  },
  plusMinusContainer: {
    marginRight: '30px',
  },
  minimizeIcon: {
    marginBottom: '15px',
  },
  errorMessage: {
    color: 'red',
  },
  successMessage: {
    color: 'green',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
})

class AddRaceForm extends React.Component {
  constructor(props) {
    super(props)
    this.submitRace = this.submitRace.bind(this)
    this.state = {
      numPlayers: 4,
      errorMessage: '',
      successMessage: '',
      formData: formDataReset,
      loading: false,
    }
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState(prevState => {
      const formData = {
        ...prevState.formData,
        [name]: value,
      }
      return { formData, successMessage: '' }
    })
  }

  addPlayer = () => {
    let { numPlayers } = this.state
    numPlayers = numPlayers > 11 ? numPlayers : numPlayers + 1
    this.setState({ numPlayers })
  }

  removePlayer = () => {
    let { numPlayers } = this.state
    numPlayers = numPlayers < 2 ? numPlayers : numPlayers - 1
    this.setState({ numPlayers })
  }

  submitRace(event) {
    event.preventDefault()
    const raceResults = {}
    for (let i = 0; i < this.state.numPlayers; i++) {
      const name = this.state.formData[`player${i}`]
      const position = this.state.formData[`player${i}Pos`]

      // Check that the name is valid
      const valid = this.validatePosition(name, position, raceResults)
      if (!valid) return
      raceResults[name] = position
    }
    this.sendRace(raceResults)
  }

  async sendRace(places) {
    this.setState({ loading: true })
    try {
      const code = getQueryVariable('code')
      const res = await fetch('/api/add-race', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ places, code }),
      })
      const resData = await res.json()
      if (resData.error) {
        this.setState({
          errorMessage: resData.error,
          successMessage: '',
          loading: false,
        })
      } else {
        this.setState({
          errorMessage: '',
          successMessage: 'Done!',
          loading: false,
          formData: formDataReset,
        })
        this.props.updatedRacesCallback(resData.races)
        this.props.updatedTournamentCallback(resData.tournament)
        setTimeout(() => this.setState({ successMessage: '' }), 5000)
      }
    } catch (err) {
      this.setState({
        successMessage: '',
        loading: false,
      })
    }
  }

  validatePosition(name, position, raceResults) {
    let errorMessage = ''
    if (name === '') {
      // Race position wasn't filled in
      errorMessage = 'Please complete all inputs.'
    } else if (position === '') {
      // Player doesn't have a position
      errorMessage = 'Every player must have a position'
    } else if (raceResults.hasOwnProperty(name)) {
      // Player appears twice
      errorMessage = "Can't have a duplicate player."
    }

    if (errorMessage !== '') {
      this.setState({ errorMessage })
      return false
    }

    this.setState({
      errorMessage: '',
    })
    return true
  }

  render() {
    const { classes, playerScores } = this.props
    const { errorMessage, successMessage, loading } = this.state
    const players = playerScores.map(player => player[0])
    const playerResultList = []

    for (let i = 0; i < this.state.numPlayers; i++) {
      playerResultList.push(
        <PlayerResultForm
          players={players}
          player={this}
          handleChange={this.handleChange}
          name={`player${i}`}
          key={i}
          selectedPlayer={this.state.formData[`player${i}`]}
          position={this.state.formData[`player${i}Pos`]}
        />
      )
    }
    return (
      <div>
        {players.length > 0 && (
          <Paper elevation={0} className={classes.addRaceContainer}>
            <Typography variant="h5">Add New Race</Typography>
            <form
              className={classes.root}
              autoComplete="off"
              onSubmit={this.submitRace}
            >
              {playerResultList}
              {loading ? (
                <CircularProgress className={classes.progress} />
              ) : (
                <div>
                  {errorMessage !== '' && (
                    <Typography class={classes.errorMessage}>
                      {errorMessage}
                    </Typography>
                  )}
                  {successMessage !== '' && (
                    <Typography class={classes.successMessage}>
                      {successMessage}
                    </Typography>
                  )}
                </div>
              )}
              <div className={classes.buttonContainer}>
                <div className={classes.plusMinusContainer}>
                  <Fab
                    color="primary"
                    aria-label="Add"
                    className={classes.button}
                    onClick={this.addPlayer}
                  >
                    <AddIcon />
                  </Fab>
                  <Fab
                    color="primary"
                    aria-label="Add"
                    className={classes.button}
                    onClick={this.removePlayer}
                  >
                    <Minimize className={classes.minimizeIcon} />
                  </Fab>
                </div>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Paper>
        )}
      </div>
    )
  }
}

AddRaceForm.propTypes = {
  classes: PropTypes.object.isRequired,
  playerScores: PropTypes.array.isRequired,
  updatedRacesCallback: PropTypes.func.isRequired,
  updatedTournamentCallback: PropTypes.func.isRequired,
}

export default withStyles(styles)(AddRaceForm)
