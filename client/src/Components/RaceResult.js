
import React, { Component } from 'react'
import TimeAgo from 'react-timeago'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Divider, Paper, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
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
    justifyContent: 'center'
  },
  col: {
    width: '50%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  chip: {
    marginTop: '20px'
  }
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
    this.deleteRace = this.deleteRace.bind(this)
    this.state = {
      deleteOpen: false
    }
  }

  handleDeleteOpen = () => {
    this.setState({ deleteOpen: true })
  }

  handleDeleteClose = () => {
    this.setState({ deleteOpen: false })
  }

  deleteRace() {
    this.setState({ deleteOpen: false })
    this.props.deleteRace(this.props.race)
  }

  render() {
    const { race, classes } = this.props
    return (
      <Paper className={classes.root}>
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
              <Chip label={ <TimeAgo date={race.date} />} className={classes.chip} />
            </div>
            <div>
              <Button
                variant="fab"
                aria-label="Delete"
                className={classes.button}
                onClick={this.handleDeleteOpen}
              >
                <DeleteIcon />
              </Button>
            </div>
          </div>
          <List className={classes.col}>
            {race.places.map((player, index) =>
            <div>
              {index !== 0 && <Divider />}
              <PlayerResult player={player} classes={classes}/>
            </div>
            )}
          </List>
          
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles)(RaceResult)
