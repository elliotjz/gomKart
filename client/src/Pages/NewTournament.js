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

class NewTournament extends Component {
  constructor(props) {
    super(props)
    this.submitNewTournament = this.submitNewTournament.bind(this)
  }

  submitNewTournament(name) {
    console.log(`tournament name: ${name}`)
    console.log("TODO: make call to API to add new tournament.")
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Paper elevation="3" className={classes.formContainer}>
          <Typography variant="h5">Add New Tournament</Typography>
          <SingleInputForm
            handleSubmit={this.submitNewTournament}
            inputLabel="Name"
            buttonLabel="Create"
          />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(NewTournament);
