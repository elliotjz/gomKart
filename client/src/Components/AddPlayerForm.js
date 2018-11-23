
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import SingleInputForm from './SingleInputForm'
import { getQueryVariable } from '../helpers'

const styles = {
  addPlayerContainer: {
    maxWidth: "400px",
    margin: "30px auto",
    padding: "20px",
  }
}

class AddPlayerForm extends Component {
  constructor(props) {
    super(props)
    this.addNewPlayer = this.addNewPlayer.bind(this)
    this.state = {
      loading: false,
      errorMessage: ""
    }
  }

  nameVerification(name) {
    // Check that the name starts with a character
    let errorMessage = ""
    const letters = /^[A-Za-z]+$/
    if (!name.charAt(0).match(letters)) {
      errorMessage = "Names must start with a letter"
    }

    // Check if the name already exists
    if (this.props.players.includes(name)) {
      errorMessage = "There's already a player with this name in the tournament"
    }

    if (errorMessage !== "") {
      this.setState({
        errorMessage
      })
      return false
    } else {
      return true
    }
  }

  async addNewPlayer(name) {
    if (!this.nameVerification(name)) return

    this.setState({ loading: true, errorMessage: "", successMessage: "" })
    try {
      const code = getQueryVariable('code')
      const res = await fetch('/api/add-player', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, code })
      })
      const tournament = await res.json()
      if (tournament.error) {
        this.setState({
          errorMessage: tournament.error,
          loading: false
        })
      } else {
        this.setState({
          loading: false,
          errorMessage: "",
          successMessage: "Done!"
        })
        this.props.addPlayerCallback(tournament)
        setTimeout(() => this.setState({successMessage: ""}), 2000)
      }
    } catch (err) {
      this.setState({
        errorMessage: "Error adding player",
        loading: false,
        successMessage: ""
      })
    }
  }

  render() {
    const { classes } = this.props
    const { errorMessage, successMessage, loading } = this.state

    return (
      <Paper elevation="0" className={classes.addPlayerContainer}>
        <Typography variant="h5">Add New Player</Typography>
        <SingleInputForm
          handleSubmit={this.addNewPlayer}
          inputLabel="Name"
          buttonLabel="Add"
          errorMessage={errorMessage}
          successMessage={successMessage}
          loading={loading}
        />
      </Paper>
    )
  }
}

export default withStyles(styles)(AddPlayerForm)
