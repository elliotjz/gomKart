import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const truncateName = (name, n) =>
  name.length > n ? `${name.substr(0, n - 1)}...` : name

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gridAutoFlow: 'dense',
    // flexWrap: 'wrap',
    // justifyContent: 'center',
  },
  playerButton: {
    margin: '8px',
    height: '30px',
    padding: '2px',
    borderRadius: '15px',
    background: '#ddd',
    fontAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    '&:hover': {
      cursor: 'pointer',
    },
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 20px 0px ${theme.palette.primary.main}`,
    },
  },
  bubble: {
    height: '16px',
    width: '16px',
    borderRadius: '50%',
    float: 'left',
  },
  text: {
    fontSize: '14px',
    marginLeft: '5px',
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
          const truncatedName = change
            ? truncateName(name, 6)
            : truncateName(name, 9)

          return (
            <button
              type="button"
              onClick={() => onClick(player[0])}
              key={index}
              className={classes.playerButton}
              style={{
                outlineColor: color,
                border: `solid 3px ${color}`,
              }}
            >
              <span className={classes.text}>
                {truncatedName} {score}
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
