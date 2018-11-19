import React, { Component } from 'react'
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
}

class JoinTournament extends Component {
  constructor(props) {
    super(props)
    this.submitJoinTournament = this.submitJoinTournament.bind(this)
  }

  submitJoinTournament(code) {
    console.log(`joining tournament: ${code}`)
    console.log("TODO: make call to API to add join tournament.")
    const joinData = {
      tournamentCode: "j3jd9s923nd",
      playerID: "098"
    }
    fetch('/api/join-tournament', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(joinData)
    })
      .then((res) => {
          if (res.status === 200) {
            return res.json()
          }
      })
      .then(data => console.log(data))
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Paper elevation="3" className={classes.formContainer}>
          <Typography variant="h5">Join Tournament</Typography>
          <SingleInputForm
            handleSubmit={this.submitJoinTournament}
            inputLabel="Tournament Code"
            buttonLabel="Join"
          />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(JoinTournament);
