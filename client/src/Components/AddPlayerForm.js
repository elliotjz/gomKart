import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import SingleInputForm from './SingleInputForm'
import { getQueryVariable, nameVerification } from '../helpers'

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
    const verification = nameVerification(name, this.props.playerScores)
    if (!verification.success) {
      this.setState({ errorMessage: verification.errorMessage })
      return
    }

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
