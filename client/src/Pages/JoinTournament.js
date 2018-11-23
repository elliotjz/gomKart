import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import SingleInputForm from '../Components/SingleInputForm';

const styles = {
  chartContainer: {
    width: "100%",
    margin: '20px auto',
  },
  formContainer: {
    maxWidth: "400px",
    margin: "30px auto",
    padding: "20px",
  },
  newPlayerBtn: {
    marginBottom: '50px',
  },
  text: {
    margin: '20px'
  }
}

class JoinTournament extends Component {
  constructor(props) {
    super(props)
    this.submitJoinTournament = this.submitJoinTournament.bind(this)
    this.state = {
      redirect: false,
      error: ""
    }
  }

  async submitJoinTournament(code) {
    try {
      const res = await fetch('/api/join-tournament', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ code })
      })
      const data = await res.json()
      if (data.success) {
        this.setState({
          redirect: true,
        })
      }
    } catch (err) {
      this.setState({
        error: "We're having trouble connecting to our server. Try again later.",
      })
    }
  }

  render() {
    const { classes } = this.props
    const { redirect, error } = this.state
    
    return (
      <div>
        {error === "" ?
        <div>
          {redirect ?
            <Redirect to="/"/> :
            <Paper elevation="3" className={classes.formContainer}>
              <Typography variant="h5">Join Tournament</Typography>
              <SingleInputForm
                handleSubmit={this.submitJoinTournament}
                inputLabel="Tournament Code"
                buttonLabel="Join"
              />
            </Paper>
          }
        </div> :
        <div>
          <Typography variant="p" className={classes.text}>
            {error}
          </Typography>
        </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(JoinTournament);
