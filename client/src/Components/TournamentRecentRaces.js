import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import RaceResult from './RaceResult'
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  error: {
    color: 'red'
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  title: {
    marginBottom: '20px'
  }
})

class TournamentRecentRaces extends Component {
  constructor(props) {
    super(props)
    this.deleteRace = this.deleteRace.bind(this)
  }

  deleteRace(race) {
    this.props.deleteRace(race)
  }
  
  render() {
    const { classes, loading, error, races } = this.props
    const shouldDisplayRaces = races !== undefined && races !== null && races.length > 0
    return (
      <div className={classes.root}>
        <Typography variant="h4" className={classes.title}>Recent Races</Typography>
        <div>
          {error !== "" &&
            <Typography variant='p' className={classes.error}>
              {error}
            </Typography>
          }
          {loading &&
            <div><CircularProgress className={classes.progress} /></div>
          }
          {shouldDisplayRaces ?
            <div>
              {races.map(race =>
                <RaceResult
                  race={race}
                  deleteRace={this.deleteRace}
                />
              )}
            </div> :
            <Typography variant="p">
              You need to add race results to the tournament.
            </Typography>
          }
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(TournamentRecentRaces)
