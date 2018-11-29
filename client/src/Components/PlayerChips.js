import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'

const styles = {
  chip: {
    margin: '8px',
    borderWidth: '3px',
    borderStyle: 'solid'
  }
}


class PlayerChips extends Component {
  render() {
    const { classes, playerScores, colors } = this.props
    return (
      <div>
        {playerScores.map((player, index) => 
          <Chip
            label={`${player[0]}: ${player[1]}`}
            className={classes.chip}
            style={{borderColor: colors[index]}}
          />
        )}
      </div>
    )
  }
}

export default withStyles(styles)(PlayerChips)
