import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import { Button } from '@material-ui/core'
import { getQueryVariable } from '../helpers'

const styles = theme => ({
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    margin: 'auto',
    width: 'fit-content',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formControl: {
    margin: '20px',
    minWidth: 120,
  },
  errorMessage: {
    color: theme.palette.error.dark,
  },
  select: {
    marginLeft: '5px',
  },
})

class DeletePlayerDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPlayer: '',
      errorMessage: '',
      loading: false,
      confirmationOpen: false,
    }
  }

  handlePlayerChange = event => {
    this.setState({
      selectedPlayer: event.target.value,
    })
  }

  handleConfirmationOpen = () => {
    if (this.state.selectedPlayer !== '') {
      this.setState({
        confirmationOpen: true,
        errorMessage: '',
      })
    } else {
      this.setState({
        errorMessage: 'Please select a player.',
      })
    }
  }

  handleConfirmationClose = () => {
    this.setState({
      confirmationOpen: false,
    })
  }

  deletePlayer = async () => {
    const { selectedPlayer } = this.state
    this.setState({ loading: true, confirmationOpen: false })
    try {
      const code = getQueryVariable('code')
      const res = await fetch('/api/delete-player', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          playerName: selectedPlayer,
        }),
      })
      const resData = await res.json()
      if (resData.error) {
        this.setState({
          errorMessage: resData.error,
          loading: false,
        })
      } else {
        this.props.changeSuccessMessage(
          `Successfully deleted player: ${selectedPlayer}`
        )
        this.setState({
          errorMessage: '',
          loading: false,
          selectedPlayer: '',
        })
        this.props.updatedTournamentCallback(resData.tournament)
        this.props.handleClose()
      }
    } catch (err) {
      this.setState({
        loading: false,
      })
    }
  }

  render() {
    const { classes, open, handleClose, playerScores } = this.props
    const {
      selectedPlayer,
      errorMessage,
      loading,
      confirmationOpen,
    } = this.state

    const options = []
    options.push(<option key={0} value="" />)
    if (playerScores) {
      playerScores.forEach((player, index) => {
        options.push(
          <option key={index + 1} value={player[0]}>
            {player[0]}
          </option>
        )
      })
    }

    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className={classes.dialog}
        >
          <DialogTitle id="alert-dialog-title">Delete Player</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <div>
              <InputLabel htmlFor={selectedPlayer}>Player</InputLabel>
              <Select
                native
                value={selectedPlayer}
                onChange={this.handlePlayerChange}
                inputProps={{
                  name: selectedPlayer,
                  id: selectedPlayer,
                }}
                className={classes.select}
              >
                {options}
              </Select>
            </div>
            {loading ? (
              <div className={classes.progressContainer}>
                <CircularProgress className={classes.progress} />
              </div>
            ) : (
              <div>
                {errorMessage !== '' && (
                  <Typography className={classes.errorMessage}>
                    {errorMessage}
                  </Typography>
                )}
              </div>
            )}
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={this.handleConfirmationOpen}
                color="secondary"
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Dialog
          open={confirmationOpen}
          onClose={this.handleConfirmationClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to delete {selectedPlayer}? Deleting this
            player will be permanent.
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleConfirmationClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deletePlayer} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

DeletePlayerDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  playerScores: PropTypes.array.isRequired,
  updatedTournamentCallback: PropTypes.func.isRequired,
  changeSuccessMessage: PropTypes.func.isRequired,
}

export default withStyles(styles)(DeletePlayerDialog)
