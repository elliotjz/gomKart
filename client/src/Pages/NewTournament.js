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
}

class NewTournament extends Component {
  constructor(props) {
    super(props)
    this.submitNewTournament = this.submitNewTournament.bind(this)
    this.state = {
      redirect: false
    }
  }

  submitNewTournament(name) {
    console.log(`tournament name: ${name}`)
    fetch('/api/new-tournament', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name })
    })
      .then(res => {
          if (res.status === 200) {
            return res.json()
          }
      })
      .then(data => {
        if (data.success) {
          this.setState({
            redirect: true
          })
        }
      })
  }

  render() {
    const { classes } = this.props
    const { redirect } = this.state
    
    return (
      <div>
        {redirect ?
        <Redirect to="/home"/> :
        <Paper elevation="3" className={classes.formContainer}>
          <Typography variant="h5">Add New Tournament</Typography>
          <SingleInputForm
            handleSubmit={this.submitNewTournament}
            inputLabel="Name"
            buttonLabel="Create"
          />
        </Paper>
        }
      </div>
    )
  }
}

export default withStyles(styles)(NewTournament);
