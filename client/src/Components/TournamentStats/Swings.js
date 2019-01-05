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

const chartOptions = {
  title: `Swings (last 50 races)`,
  vAxis: {
    title: 'Score Change',
  },
  legend: 'none',
  chartArea: { width: '85%', height: '80%' },
}

class Swings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      swingChartData: null,
      swingPeriod: null,
    }
  }

  componentDidMount() {
    const period =
      this.props.tournament.raceCounter > 50
        ? 50
        : this.props.tournament.raceCounter
    const swingChartData = this.getSwings(period)
    this.setState({
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
      if (player.name !== '_comp' && player.active) {
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

  render() {
    const { classes } = this.props
    const { swingChartData, swingPeriod } = this.state
    const loader = (
      <div className={classes.chartLoader}>
        <CircularProgress className={classes.loader} />
      </div>
    )

    const editedSwingChartOptions = chartOptions
    editedSwingChartOptions.title = `Swings (last ${swingPeriod} races)`

    return (
      <div>
        <Typography variant="h4">Swings</Typography>
        {swingChartData !== null ? (
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={swingChartData}
            options={editedSwingChartOptions}
            loader={loader}
          />
        ) : (
          loader
        )}
      </div>
    )
  }
}

Swings.propTypes = {
  classes: PropTypes.object.isRequired,
  tournament: PropTypes.object.isRequired,
}

export default withStyles(styles)(Swings)
