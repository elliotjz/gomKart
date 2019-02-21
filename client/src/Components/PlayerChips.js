import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  playerButton: {
    margin: '8px',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    border: 0,
    background: 'transparent',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  color: {
    backgroundColor: 'red',
    height: '16px',
    width: '16px',
    borderRadius: '50%',
    float: 'left',
  },
  text: {
    fontSize: '14px',
    marginLeft: '5px',
    float: 'left',
  },
  scoreChange: {
    marginLeft: '5px',
    fontWeight: '700',
  },
})

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
      <div className={classes.root}>
        {playerScores.map((player, index) => {
          const color = excludedPlayers.includes(player[0])
            ? '#bbb'
            : colors[index]
          const [name, score, change] = player

          return (
            <button
              type="button"
              onClick={() => onClick(player[0])}
              key={index}
              className={classes.playerButton}
              style={{ outlineColor: color }}
            >
              <span
                className={classes.color}
                style={{ backgroundColor: color }}
              />
              <span className={classes.text}>
                {name}: {score}
                {change && (
                  <span
                    className={classes.scoreChange}
                    style={change > 0 ? { color: 'green' } : { color: 'red' }}
                  >
                    {change > 0 && '+'}
                    {change}
                  </span>
                )}
              </span>
            </button>
          )
        })}
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
