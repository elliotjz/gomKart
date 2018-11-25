
import React from 'react'
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

const RaceResult = ({ race, classes }) => (
  <Paper className={classes.root}>
    <Chip label={ <TimeAgo date={race.date} />} className={classes.chip} />
       
    <List>
      {race.places.map(player =>
      <div>
        <Divider />
        <PlayerResult player={player} classes={classes}/>
      </div>
      )}
    </List>
    <Button variant="fab" color="secondary" aria-label="Delete" className={classes.button}>
      <DeleteIcon />
    </Button>
  </Paper>
)

export default withStyles(styles)(RaceResult)
