import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button } from '@material-ui/core'

import CircularProgress from '@material-ui/core/CircularProgress'
import RaceResult from './RaceResult'

const styles = theme => ({
  error: {
    color: 'red',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  title: {
    marginBottom: '20px',
  },
})

class TournamentRecentRaces extends Component {
  deleteRace = race => {
    this.props.deleteRace(race)
  }

  render() {
    const {
      classes,
      loading,
      error,
      recentRacesBottomError,
      races,
      displayMoreRaces,
      loadingMoreRaces,
    } = this.props
    const shouldDisplayRaces =
      races !== undefined && races !== null && races.length > 0
    return (
      <div className={classes.root}>
        <Typography variant="h4" className={classes.title}>
          Recent Races
        </Typography>
        <div>
          {error !== '' && (
            <Typography variant="p" className={classes.error}>
              {error}
            </Typography>
          )}
          {loading ? (
            <div>
              <CircularProgress className={classes.progress} />
            </div>
          ) : (
            <div>
              {shouldDisplayRaces ? (
                <div>
                  {races.map((race, index) => (
                    <RaceResult
                      key={index}
                      race={race}
                      deleteRace={this.deleteRace}
                    />
                  ))}
                  {recentRacesBottomError !== '' ? (
                    <Typography variant="body1" className={classes.error}>
                      {recentRacesBottomError}
                    </Typography>
                  ) : (
                    <div>
                      {loadingMoreRaces ? (
                        <div>
                          <CircularProgress className={classes.progress} />
                        </div>
                      ) : (
                        <Button color="primary" onClick={displayMoreRaces}>
                          Load More
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Typography variant="body1">
                  You need to add race results to the tournament.
                </Typography>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

TournamentRecentRaces.propTypes = {
  deleteRace: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  recentRacesBottomError: PropTypes.string.isRequired,
  races: PropTypes.array.isRequired,
  displayMoreRaces: PropTypes.func.isRequired,
  loadingMoreRaces: PropTypes.bool.isRequired,
}

export default withStyles(styles)(TournamentRecentRaces)
