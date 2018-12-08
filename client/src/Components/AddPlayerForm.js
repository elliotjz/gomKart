import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import SingleInputForm from './SingleInputForm'
import { getQueryVariable } from '../helpers'

const styles = {
  addPlayerContainer: {
    maxWidth: '400px',
    margin: '30px auto',
    padding: '20px',
  },
}

class AddPlayerForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      errorMessage: '',
      successMessage: '',
      name: '',
    }
  }

  handleChange = event => {
    this.setState({
      name: event.target.value,
    })
  }

  addNewPlayer = async () => {
    const { name } = this.state
    if (!this.nameVerification(name)) return

    this.setState({ loading: true, errorMessage: '', successMessage: '' })
    try {
      const code = getQueryVariable('code')
      const res = await fetch('/api/add-player', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code }),
      })
      const tournament = await res.json()
      if (tournament.error) {
        this.setState({
          errorMessage: tournament.error,
          loading: false,
        })
      } else {
        this.setState({
          loading: false,
          errorMessage: '',
          successMessage: 'Done!',
          name: '',
        })
        this.props.addPlayerCallback(tournament)
        setTimeout(() => this.setState({ successMessage: '' }), 5000)
      }
    } catch (err) {
      this.setState({
        errorMessage: 'Error adding player',
        loading: false,
        successMessage: '',
      })
    }
  }

  nameVerification(name) {
    // Check that the name starts with a character
    let errorMessage = ''

    // verify length
    if (name.length > 16)
      errorMessage = "Your name can't be more than 16 characters long."

    // verify characters
    // /^[a-z0-9\s]+$/i

    if (name.match(/^[-'0-9a-zÀ-ÿ]+$/i) === null)
      errorMessage = 'Your name must only contain letters and numbers'

    // verify first letter
    const letters = /^[A-Za-zÀ-ÿ]+$/
    if (!name.charAt(0).match(letters))
      errorMessage = 'Names must start with a letter'

    // Check if the name already exists
    const players = this.props.playerScores.map(player => player[0])
    if (players.includes(name))
      errorMessage = "There's already a player with this name in the tournament"

    if (errorMessage !== '') {
      this.setState({
        errorMessage,
      })
      return false
    }

    return true
  }

  render() {
    const { classes } = this.props
    const { errorMessage, successMessage, loading, name } = this.state

    return (
      <Paper elevation={0} className={classes.addPlayerContainer}>
        <Typography variant="h5">Add New Player</Typography>
        <SingleInputForm
          handleSubmit={this.addNewPlayer}
          inputLabel="Name"
          buttonLabel="Add"
          errorMessage={errorMessage}
          successMessage={successMessage}
          loading={loading}
          handleChange={this.handleChange}
          value={name}
        />
      </Paper>
    )
  }
}

AddPlayerForm.propTypes = {
  addPlayerCallback: PropTypes.func.isRequired,
  playerScores: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AddPlayerForm)
