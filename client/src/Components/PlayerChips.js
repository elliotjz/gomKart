import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'

const styles = {
  chip: {
    margin: '8px',
    borderWidth: '3px',
    borderStyle: 'solid',
    '&:focus': {
      backgroundColor: '#ddd',
    },
  },
}

class PlayerChips extends Component {
  render() {
    const {
      classes,
      playerScores,
      colors,
      onClick,
      excludedPlayers,
    } = this.props

    return (
      <div>
        {playerScores.map((player, index) => (
          <Chip
            key={index}
            label={`${player[0]}: ${player[1]}`}
            className={classes.chip}
            style={
              excludedPlayers.includes(player[0])
                ? { borderColor: '#bbb' }
                : { borderColor: colors[index] }
            }
            onClick={() => onClick(player[0])}
          />
        ))}
      </div>
    )
  }
}

PlayerChips.propTypes = {
  classes: PropTypes.object.isRequired,
  playerScores: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  excludedPlayers: PropTypes.array.isRequired,
}

export default withStyles(styles)(PlayerChips)
