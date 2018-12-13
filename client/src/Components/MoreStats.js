import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Chart } from 'react-google-charts'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { CircularProgress } from '@material-ui/core'

const styles = {
  root: {
    marginTop: '50px',
  },
  bestAndWorst: {
    margin: '30px auto',
  },
  chartLoader: {
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  loader: {
    margin: 'auto',
  },
}

const mostRacesChartOptions = {
  title: 'Races Completed',
  vAxis: {
    title: 'Races',
  },
  legend: 'none',
  chartArea: { width: '85%', height: '80%' },
}

const swingChartOptions = {
  title: `Swings (last 50 races)`,
  vAxis: {
    title: 'Score Change',
  },
  legend: 'none',
  chartArea: { width: '85%', height: '80%' },
}

class MoreStats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      raceCountData: null,
      highAndLow: null,
      swingChartData: null,
      swingPeriod: null,
    }
  }

  componentDidMount() {
    const raceCountData = this.getRaceCountData()
    const highAndLow = this.getHighestAndLowestScores()
    const period =
      this.props.tournament.raceCounter > 50
        ? 50
        : this.props.tournament.raceCounter
    const swingChartData = this.getSwings(period)
    this.setState({
      raceCountData,
      highAndLow,
      swingChartData,
      swingPeriod: period,
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

  getSwings(period) {
    const { scoreHistory, raceCounter } = this.props.tournament
    if (raceCounter < period) {
      return null
    }
    const swingChartData = []

    scoreHistory.forEach(player => {
      if (player.name !== '_comp') {
        const currentScore = this.getCurrentScore(player.scores, raceCounter)
        const score50RacesAgo = this.getCurrentScore(
          player.scores,
          raceCounter - period
        )
        let swing = currentScore - score50RacesAgo
        swing = parseInt(swing.toFixed())
        swingChartData.push([player.name, swing])
      }
    })
    swingChartData.sort((a, b) => b[1] - a[1])
    if (swingChartData.length > 8) {
      swingChartData.splice(4, swingChartData.length - 8)
    }
    swingChartData.unshift(['Player', `Swing (last ${period} races)`])
    return swingChartData
  }

  getHighestAndLowestScores() {
    const { scoreHistory } = this.props.tournament

    let maxScore = -200
    let minScore = 99999999
    let maxScorePlayer = ''
    let minScorePlayer = ''
    scoreHistory.forEach(player => {
      if (player.name !== '_comp') {
        const scores = Object.values(player.scores)
        const playerMax = Math.max.apply(null, scores)
        const playerMin = Math.min.apply(null, scores)
        if (playerMax > maxScore) {
          maxScore = playerMax
          maxScorePlayer = player.name
        }
        if (playerMin < minScore) {
          minScore = playerMin
          minScorePlayer = player.name
        }
      }
    })
    maxScore = maxScore.toFixed()
    minScore = minScore.toFixed()
    return { maxScore, maxScorePlayer, minScore, minScorePlayer }
  }

  getRaceCountData() {
    const { scoreHistory } = this.props.tournament

    const raceCounts = scoreHistory.map(player => [
      player.name,
      Object.keys(player.scores).length - 1,
    ])

    raceCounts.sort((a, b) => b[1] - a[1])
    const raceCountData = [['Player', 'Race Count']]
    raceCountData.push(...raceCounts.slice(1, 9))
    return raceCountData
  }

  render() {
    const { classes } = this.props
    const {
      raceCountData,
      highAndLow,
      swingChartData,
      swingPeriod,
    } = this.state
    const loader = (
      <div className={classes.chartLoader}>
        <CircularProgress className={classes.loader} />
      </div>
    )

    const editedSwingChartOptions = swingChartOptions
    editedSwingChartOptions.title = `Swings (last ${swingPeriod} races)`

    return (
      <div>
        {highAndLow !== null && (
          <div className={classes.root}>
            <Typography variant="h4">Stats</Typography>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={raceCountData}
              options={mostRacesChartOptions}
              loader={loader}
            />
            <div className={classes.bestAndWorst}>
              <Typography variant="h6">
                Highest Score Ever - {highAndLow.maxScorePlayer}:{' '}
                {highAndLow.maxScore}
              </Typography>
              <Typography variant="h6">
                Lowest Score Ever - {highAndLow.minScorePlayer}:{' '}
                {highAndLow.minScore}
              </Typography>
            </div>
            {swingChartData && (
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={swingChartData}
                options={editedSwingChartOptions}
                loader={loader}
              />
            )}
          </div>
        )}
      </div>
    )
  }
}

MoreStats.propTypes = {
  classes: PropTypes.object.isRequired,
  tournament: PropTypes.object.isRequired,
}

export default withStyles(styles)(MoreStats)
