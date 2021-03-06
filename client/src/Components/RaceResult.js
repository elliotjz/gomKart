import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TimeAgo from 'react-timeago'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Divider, Paper, Button } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: theme.palette.background.paper,
    margin: '30px auto',
    padding: '10px',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  col: {
    width: '50%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  chip: {
    marginTop: '20px',
  },
})

const PlayerResult = ({ player, classes }) => (
  <ListItem>
    <ListItemText primary={player.position} />
    <ListItemText primary={player.name} />
  </ListItem>
)

class RaceResult extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deleteOpen: false,
    }
  }

  handleDeleteOpen = () => {
    this.setState({ deleteOpen: true })
  }

  handleDeleteClose = () => {
    this.setState({ deleteOpen: false })
  }

  deleteRace = () => {
    this.setState({ deleteOpen: false })
    this.props.deleteRace(this.props.race)
  }

  render() {
    const { race, classes } = this.props
    return (
      <Paper elevation={0} className={classes.root}>
        <Dialog
          open={this.state.deleteOpen}
          onClose={this.handleDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to delete this race?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleDeleteClose} color="primary">
              No
            </Button>
            <Button onClick={this.deleteRace} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <div className={classes.container}>
          <div className={classes.col}>
            <div>
              <Chip
                label={<TimeAgo date={race.date} />}
                className={classes.chip}
              />
            </div>
            <div>
              <Button
                className={classes.button}
                onClick={this.handleDeleteOpen}
                color="secondary"
              >
                Delete
              </Button>
            </div>
          </div>
          <List className={classes.col}>
            {race.places.map((player, index) => (
              <div key={index}>
                {index !== 0 && <Divider />}
                <PlayerResult player={player} classes={classes} />
              </div>
            ))}
          </List>
        </div>
      </Paper>
    )
  }
}

PlayerResult.propTypes = {
  player: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

RaceResult.propTypes = {
  classes: PropTypes.object.isRequired,
  deleteRace: PropTypes.func.isRequired,
  race: PropTypes.object.isRequired,
}

export default withStyles(styles)(RaceResult)
