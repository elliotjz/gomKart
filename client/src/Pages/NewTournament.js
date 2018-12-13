import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import SingleInputForm from '../Components/SingleInputForm'
import { nameVerification } from '../helpers'

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

  addNewTournament = async () => {
    const { name } = this.state
    const verification = nameVerification(name, [])
    if (!verification.success) {
      this.setState({ errorMessage: verification.errorMessage })
      return
    }

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
