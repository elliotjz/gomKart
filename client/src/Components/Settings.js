import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button } from '@material-ui/core'
import ChangeNameDialog from './ChangeNameDialog'

const styles = {
  root: {},
  title: {
    marginBottom: '20px',
  },
}

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editNameDialogOpen: false,
    }
  }

  openEditNameDialog = () => {
    this.setState({
      editNameDialogOpen: true,
    })
  }

  closeEditNameDialog = () => {
    this.setState({
      editNameDialogOpen: false,
    })
  }

  render() {
    const {
      classes,
      playerScores,
      updatedRacesCallback,
      updatedTournamentCallback,
    } = this.props
    const { editNameDialogOpen } = this.state

    return (
      <div className={classes.root}>
        <ChangeNameDialog
          open={editNameDialogOpen}
          handleClose={this.closeEditNameDialog}
          playerScores={playerScores}
          updatedRacesCallback={updatedRacesCallback}
          updatedTournamentCallback={updatedTournamentCallback}
        />
        <Typography className={classes.title} variant="h4">
          Settings
        </Typography>
        <Button color="primary" onClick={this.openEditNameDialog}>
          Change player names
        </Button>
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
