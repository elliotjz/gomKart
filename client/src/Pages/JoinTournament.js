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

class JoinTournament extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      errorMessage: '',
      loading: false,
      code: '',
    }
  }

  handleChange = event => {
    this.setState({
      code: event.target.value,
    })
  }

  submitJoinTournament = async () => {
    const { code } = this.state
    this.setState({
      errorMessage: '',
      loading: true,
    })
    try {
      const res = await fetch('/api/join-tournament', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (data.success) {
        this.setState({
          redirect: true,
          loading: false,
          errorMessage: '',
        })
      } else {
        this.setState({
          errorMessage: 'There is not tournament with that code.',
          loading: false,
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
    const { redirect, errorMessage, loading, code } = this.state

    return (
      <div>
        <div>
          {redirect ? (
            <Redirect to="/" />
          ) : (
            <Paper elevation={0} className={classes.formContainer}>
              <Typography variant="h5">Join Tournament</Typography>
              <SingleInputForm
                handleSubmit={this.submitJoinTournament}
                inputLabel="Tournament Code"
                buttonLabel="Join"
                errorMessage={errorMessage}
                loading={loading}
                handleChange={this.handleChange}
                value={code}
              />
            </Paper>
          )}
        </div>
      </div>
    )
  }
}

JoinTournament.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(JoinTournament)
