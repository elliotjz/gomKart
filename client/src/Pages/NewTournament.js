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

class NewTournament extends Component {
  constructor(props) {
    super(props)
    this.addNewTournament = this.addNewTournament.bind(this)
    this.state = {
      redirect: false,
      errorMessage: "",
      successMessage: ""
    }
  }

  nameVerification(name) {
    // Check that the name starts with a character
    let errorMessage = ""
    const letters = /^[A-Za-z]+$/
    if (!name.charAt(0).match(letters)) {
      errorMessage = "Tournament name must start with a letter"
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

  async addNewTournament(name) {
    if (!this.nameVerification(name)) return

    this.setState({ errorMessage: "", successMessage: "Loading..." })

    try {
      const res = await fetch('/api/new-tournament', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name })
      })
      const data = await res.json()
      if (data.success) {
        this.setState({
          redirect: true
        })
      }
    } catch (err) {
      this.setState({
        errorMessage: "We're having trouble connecting to our server. Try again later.",
      })
    }
  }

  render() {
    const { classes } = this.props
    const { redirect, errorMessage, successMessage } = this.state
    
    return (
      <div>
        {redirect ?
        <Redirect to="/"/> :
        <Paper elevation="3" className={classes.formContainer}>
          <Typography variant="h5">Add New Tournament</Typography>
          <SingleInputForm
            handleSubmit={this.addNewTournament}
            inputLabel="Name"
            buttonLabel="Create"
            successMessage={successMessage}
            errorMessage={errorMessage}
          />
        </Paper>
        }
      </div>
    )
  }
}

export default withStyles(styles)(NewTournament);
