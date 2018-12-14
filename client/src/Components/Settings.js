import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button } from '@material-ui/core'
import EditPlayerDialog from './EditPlayerDialog'
import DeletePlayerDialog from './DeletePlayerDialog'

const styles = {
  root: {},
  title: {
    marginBottom: '20px',
  },
  successContainer: {
    border: 'green 1px solid',
    borderRadius: '3px',
    backgroundColor: '#cdf4cd',
    marginBottom: '10px',
  },
  buttonContainer: {
    margin: '10px',
  },
}

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editPlayerDialogOpen: false,
      deletePlayerDialogOpen: false,
      successMessage: '',
    }
  }

  changeSuccessMessage = successMessage => {
    this.setState({
      successMessage,
    })
  }

  openEditPlayerDialog = () => {
    this.setState({
      editPlayerDialogOpen: true,
    })
  }

  closeEditPlayerDialog = () => {
    this.setState({
      editPlayerDialogOpen: false,
    })
  }

  openDeletePlayerDialog = () => {
    this.setState({
      deletePlayerDialogOpen: true,
    })
  }

  closeDeletePlayerDialog = () => {
    this.setState({
      deletePlayerDialogOpen: false,
    })
  }

  render() {
    const {
      classes,
      playerScores,
      updatedRacesCallback,
      updatedTournamentCallback,
    } = this.props
    const {
      editPlayerDialogOpen,
      deletePlayerDialogOpen,
      successMessage,
    } = this.state

    return (
      <div className={classes.root}>
        {successMessage !== '' && (
          <div className={classes.successContainer}>
            <Typography variant="body1">{successMessage}</Typography>
          </div>
        )}
        <EditPlayerDialog
          open={editPlayerDialogOpen}
          handleClose={this.closeEditPlayerDialog}
          playerScores={playerScores}
          updatedRacesCallback={updatedRacesCallback}
          updatedTournamentCallback={updatedTournamentCallback}
          changeSuccessMessage={this.changeSuccessMessage}
        />
        <DeletePlayerDialog
          open={deletePlayerDialogOpen}
          handleClose={this.closeDeletePlayerDialog}
          playerScores={playerScores}
          updatedRacesCallback={updatedRacesCallback}
          updatedTournamentCallback={updatedTournamentCallback}
          changeSuccessMessage={this.changeSuccessMessage}
        />
        <Typography className={classes.title} variant="h4">
          Settings
        </Typography>
        <div className={classes.buttonContainer}>
          <Button color="primary" onClick={this.openEditPlayerDialog}>
            Edit Player
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <Button color="primary" onClick={this.openDeletePlayerDialog}>
            Delete Player
          </Button>
        </div>
      </div>
    )
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  playerScores: PropTypes.array.isRequired,
  updatedRacesCallback: PropTypes.func.isRequired,
  updatedTournamentCallback: PropTypes.func.isRequired,
}

export default withStyles(styles)(Settings)
