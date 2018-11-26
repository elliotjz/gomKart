
import React, { Component } from 'react'
import TimeAgo from 'react-timeago'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Divider, Paper, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: theme.palette.background.paper,
    margin: '5px auto',
    padding: '5px',
  },
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  col: {
    width: '50%'
  },
  timeAgo: {
    textAlign: 'left',
    margin: '0 10px 10px 0'
  },
  button: {
    margin: theme.spacing.unit,
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
    this.deleteRace = this.deleteRace.bind(this)
  }
  deleteRace() {
    this.props.deleteRace(this.props.race)
  }

  render() {
    const { race, classes } = this.props
    return (
      <Paper className={classes.root}>
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
                onClick={this.deleteRace}
              >
                <DeleteIcon />
              </Button>
            </div>
          </div>
          <List className={classes.col}>
            {race.places.map(player =>
            <div>
              <Divider />
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
