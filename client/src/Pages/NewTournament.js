import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import SingleInputForm from '../Components/SingleInputForm'

const styles = {
  chartContainer: {
    width: '100%',
    margin: '20px auto',
  },
  formContainer: {
    maxWidth: '400px',
    margin: '30px auto',
    padding: '20px',
  },
  newPlayerBtn: {
    marginBottom: '50px',
  },
  text: {
    margin: '20px',
  },
}

class NewTournament extends Component {
  constructor(props) {
    super(props)
    this.addNewTournament = this.addNewTournament.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      redirect: false,
      errorMessage: '',
      successMessage: '',
      loading: false,
      name: '',
    }
  }

  handleChange = event => {
    this.setState({
      name: event.target.value,
    })
  }

  async addNewTournament() {
    const { name } = this.state
    if (!this.nameVerification(name)) return

    this.setState({
      errorMessage: '',
      successMessage: '',
      loading: true,
    })

    try {
      const res = await fetch('/api/new-tournament', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const resData = await res.json()
      if (resData.success) {
        this.setState({
          redirect: true,
        })
      } else {
        this.setState({
          loading: false,
          errorMessage: resData.error,
        })
      }
    } catch (err) {
      this.setState({
        errorMessage:
          "We're having trouble connecting to our server. Try again later.",
        loading: false,
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
    if (name.match(/^[a-z0-9\s]+$/i) === null)
      errorMessage = 'Your name must only contain letters and numbers'

    // verify first letter
    const letters = /^[A-Za-z]+$/
    if (!name.charAt(0).match(letters))
      errorMessage = 'Names must start with a letter'

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
    const { redirect, errorMessage, successMessage, loading, name } = this.state

    return (
      <div>
        {redirect ? (
          <Redirect to="/" />
        ) : (
          <Paper elevation={0} className={classes.formContainer}>
            <Typography variant="h5">Add New Tournament</Typography>
            <SingleInputForm
              handleSubmit={this.addNewTournament}
              inputLabel="Name"
              buttonLabel="Create"
              successMessage={successMessage}
              errorMessage={errorMessage}
              loading={loading}
              handleChange={this.handleChange}
              value={name}
            />
          </Paper>
        )}
      </div>
    )
  }
}

NewTournament.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(NewTournament)
