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
    const { classes, playerScores, colors, onClick, excludedPlayers } = this.props
    
    return (
      <div>
        {playerScores.map((player, index) => 
          <Chip
            label={`${player[0]}: ${player[1]}`}
            className={classes.chip}
            style={
              excludedPlayers.includes(player[0]) ?
              {borderColor: "#bbb"} :
              {borderColor: colors[index]}
            }
            onClick={() => onClick(player[0])}
          />
        )}
      </div>
    )
  }
}

export default withStyles(styles)(PlayerChips)
