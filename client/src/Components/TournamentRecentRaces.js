import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import { colors } from '../helpers'
import PlayerChips from './PlayerChips'

const styles = {
  root: {

  },
}

const TournamentRecentRaces = ({ players, parsedData, classes }) => (
  <div className={classes.root}>
      <PlayerChips
        players={players}
        parsedData={parsedData}
        colors={colors}
      />
    <div>Recent Races Coming Soon</div>
  </div>
)

export default withStyles(styles)(TournamentRecentRaces)
