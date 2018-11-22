import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'

const styles = {
  chip: {
    margin: '20px 8px 0px 8px',
    borderWidth: '3px',
    borderStyle: 'solid'
  }
}


class PlayerChips extends Component {
  getCurrentScores() {
    const { players, parsedData } = this.props
    if (parsedData !== null) {
      let currentScores = {}
      for (let i = 0; i < players.length; i++) {
        const player = players[i]
        const index = parsedData[0].indexOf(player)
        const score = parsedData[parsedData.length - 1][index]
        currentScores[player] = score.toFixed(0)
      }
      return currentScores
    } else {
      return 0
    }
  }

  render() {
    const { classes, players, colors } = this.props
    const currentScores = this.getCurrentScores()
    return (
      <div>
        {players.map((player, index) => 
          <Chip
            label={`${player}: ${currentScores[player]}`}
            className={classes.chip}
            style={{borderColor: colors[index]}}
          />
        )}
      </div>
    )
  }
}

export default withStyles(styles)(PlayerChips)
