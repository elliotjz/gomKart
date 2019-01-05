import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Chart } from 'react-google-charts'
import Typography from '@material-ui/core/Typography'
import { Button, CircularProgress } from '@material-ui/core'

import { colors } from '../../helpers'
import PlayerChips from '../PlayerChips'

const styles = theme => ({
  root: {},
  chartLoader: {
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    marginBottom: '20px',
  },
  loader: {
    margin: 'auto',
  },
  domainButtonContainer: {
    color: theme.palette.primary.dark,
  },
})

const chartOptions = {
  curveType: 'none',
  legend: 'none',
  colors,
  chartArea: { width: '85%', height: '80%' },
  vAxis: { baseline: 200 },
}

const chartDomains = ['All', 400, 100, 50]

class TournamentChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chartDomainIndex: 2,
      excludedPlayers: [],
      parsedTournament: null,
    }
  }

  componentDidMount() {
    const { playerScores } = this.props
    const excludedPlayers = playerScores.slice(10).map(player => player[0])
    this.setState({
      parsedTournament: this.parseTournament(null, excludedPlayers),
      excludedPlayers,
    })
  }

  onChipClick = name => {
    const { excludedPlayers } = this.state
    if (excludedPlayers.includes(name)) {
      const index = excludedPlayers.indexOf(name)
      excludedPlayers.splice(index, 1)
    } else {
      excludedPlayers.push(name)
    }
    const parsedTournament = this.parseTournament(null, excludedPlayers)
    this.setState({
      parsedTournament,
      excludedPlayers,
    })
  }

  getCurrentScore(scores, raceCounter) {
    let currentScore
    let i = raceCounter
    while (currentScore === undefined && i >= 0) {
      if (scores[i.toString()] !== undefined) {
        currentScore = scores[i.toString()]
      }
      i -= 1
    }
    return currentScore
  }

  changeDomain = index => {
    const parsedTournament = this.parseTournament(index, null)
    this.setState({
      parsedTournament,
      chartDomainIndex: index,
    })
  }

  parseTournament(chartDomainIndexParam, excludedPlayersParam) {
    const { tournament, playerScores } = this.props
    const chartDomainIndex =
      chartDomainIndexParam === null || chartDomainIndexParam === undefined
        ? this.state.chartDomainIndex
        : chartDomainIndexParam
    const excludedPlayers = excludedPlayersParam || this.state.excludedPlayers
    const parsedColors = colors.slice()
    const colorsToRemove = []

    if (tournament && tournament.length !== {}) {
      const parsedData = [['Race']]
      const { scoreHistory } = tournament

      // Find the domain of the chart
      let startIndex = 0
      const chartDomain = chartDomains[chartDomainIndex]
      if (chartDomainIndex !== 0 && chartDomain < tournament.raceCounter) {
        startIndex = tournament.raceCounter - chartDomain
      }

      // Add a column for each race
      for (let i = startIndex; i <= tournament.raceCounter; i++) {
        parsedData.push([i.toString()])
      }

      // Add scores for each player
      playerScores.forEach((playerScore, i) => {
        const name = playerScore[0]
        // exclude excluded players
        if (!excludedPlayers.includes(name) && name !== '_comp') {
          // get index of player
          const index = scoreHistory.findIndex(x => x.name === playerScore[0])
          const player = scoreHistory[index]
          parsedData[0].push(player.name)
          let lastResult = this.getCurrentScore(player.scores, startIndex)
          for (let j = 1; j < parsedData.length; j++) {
            if (player.scores.hasOwnProperty(parsedData[j][0].toString())) {
              lastResult = player.scores[parsedData[j][0].toString()]
            }
            parsedData[j].push(lastResult)
          }
        } else if (name !== '_comp') {
          colorsToRemove.push(i)
        }
      })
      for (let i = colorsToRemove.length - 1; i >= 0; i--) {
        parsedColors.splice(colorsToRemove[i], 1)
      }
      return [parsedData, parsedColors]
    }
  }

  render() {
    const { playerScores, classes } = this.props
    const { chartDomainIndex, excludedPlayers, parsedTournament } = this.state
    let parsedData
    let parsedColors
    if (parsedTournament) {
      parsedData = parsedTournament[0]
      parsedColors = parsedTournament[1]
    }
    chartOptions.colors = parsedColors

    return (
      <div>
        <Typography variant="h4" className={classes.title}>
          Tournament Chart
        </Typography>
        {parsedData !== undefined && parsedData.length > 2 ? (
          <div className={classes.root}>
            <PlayerChips
              playerScores={playerScores}
              colors={colors}
              onClick={this.onChipClick}
              excludedPlayers={excludedPlayers}
            />
            {parsedData[0].length > 1 && (
              <div>
                <Chart
                  chartType="LineChart"
                  width="100%"
                  height="600px"
                  data={parsedData}
                  options={chartOptions}
                  loader={
                    <div className={classes.chartLoader}>
                      <CircularProgress className={classes.loader} />
                    </div>
                  }
                />
              </div>
            )}
            <div className={classes.domainButtonContainer}>
              {chartDomains.map((domain, index) => (
                <Button
                  key={index}
                  color="inherit"
                  size="small"
                  variant={chartDomainIndex === index ? 'outlined' : 'text'}
                  onClick={() => this.changeDomain(index)}
                >
                  {domain}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Typography variant="body1">
              Add a race result to see the tournament statistics.
            </Typography>
          </div>
        )}
      </div>
    )
  }
}

TournamentChart.propTypes = {
  tournament: PropTypes.object.isRequired,
  playerScores: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TournamentChart)
