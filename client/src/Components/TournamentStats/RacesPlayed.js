import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Chart } from 'react-google-charts'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { CircularProgress } from '@material-ui/core'

const styles = {
  root: {},
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
  title: 'Races Played',
  vAxis: {
    title: 'Races',
  },
  legend: 'none',
  chartArea: { width: '85%', height: '80%' },
}

class RacesPlayed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      raceCountData: null,
    }
  }

  componentDidMount() {
    const raceCountData = this.getRaceCountData()
    this.setState({
      raceCountData,
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

  getRaceCountData() {
    const { scoreHistory } = this.props.tournament
    let raceCounts = scoreHistory.filter(el => el.active)
    raceCounts = scoreHistory.map(player => [
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
    const { raceCountData } = this.state
    const loader = (
      <div className={classes.chartLoader}>
        <CircularProgress className={classes.loader} />
      </div>
    )

    return (
      <div>
        <Typography variant="h4">Races Played</Typography>
        {raceCountData !== null ? (
          <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={raceCountData}
            options={chartOptions}
            loader={loader}
          />
        ) : (
          loader
        )}
      </div>
    )
  }
}

RacesPlayed.propTypes = {
  classes: PropTypes.object.isRequired,
  tournament: PropTypes.object.isRequired,
}

export default withStyles(styles)(RacesPlayed)
