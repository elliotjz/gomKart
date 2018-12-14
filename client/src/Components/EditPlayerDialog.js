import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import DialogContent from '@material-ui/core/DialogContent'

import { nameVerification, getQueryVariable } from '../helpers'
import SingleInputForm from './SingleInputForm'

const styles = {
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
    color: 'red',
  },
  select: {
    marginLeft: '5px',
  },
}

class ChangeNameDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPlayer: '',
      newPlayerName: '',
      errorMessage: '',
      loading: false,
    }
  }

  handlePlayerChange = event => {
    this.setState({
      selectedPlayer: event.target.value,
    })
  }

  handleNewPlayerNameChange = event => {
    this.setState({
      newPlayerName: event.target.value,
    })
  }

  handleSubmit = () => {
    const { newPlayerName, selectedPlayer } = this.state
    const { playerScores } = this.props
    const verification = nameVerification(newPlayerName, playerScores)
    if (!verification.success) {
      this.setState({ errorMessage: verification.errorMessage })
    } else if (selectedPlayer === '') {
      this.setState({ errorMessage: 'Please select a player' })
    } else {
      this.changeName()
    }
  }

  async changeName() {
    const { newPlayerName, selectedPlayer } = this.state
    this.setState({ loading: true })
    try {
      const code = getQueryVariable('code')
      const res = await fetch('/api/change-player-name', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          newPlayerName,
          oldPlayerName: selectedPlayer,
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
          `Successfully changed player name from ${selectedPlayer} to ${newPlayerName}`
        )
        this.setState({
          errorMessage: '',
          loading: false,
          newPlayerName: '',
          selectedPlayer: '',
        })
        this.props.updatedRacesCallback(resData.races)
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
    const { selectedPlayer, newPlayerName, errorMessage, loading } = this.state

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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.dialog}
      >
        <DialogTitle id="alert-dialog-title">Edit Player Name</DialogTitle>
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
          <SingleInputForm
            inputLabel="New Name"
            buttonLabel="Submit"
            errorMessage={errorMessage}
            successMessage=""
            loading={loading}
            handleChange={this.handleNewPlayerNameChange}
            handleSubmit={this.handleSubmit}
            value={newPlayerName}
          />
        </DialogContent>
      </Dialog>
    )
  }
}

ChangeNameDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  playerScores: PropTypes.array.isRequired,
  updatedRacesCallback: PropTypes.func.isRequired,
  updatedTournamentCallback: PropTypes.func.isRequired,
  changeSuccessMessage: PropTypes.func.isRequired,
}

export default withStyles(styles)(ChangeNameDialog)
