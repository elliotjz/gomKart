import React, { Component } from 'react'
import { Chart } from 'react-google-charts'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Button } from '@material-ui/core'

const styles = {
  root: {

  },
  moreStats: {
    marginTop: '50px',
  },
  bestAndWorst: {
    margin: '30px auto'
  }
}

const mostRacesChartOptions = {
  title: "Races Completed",
  vAxis: {
    title: 'Races'
  },
  legend: 'none',
}

class MoreStats extends Component {
  constructor(props) {
    super(props)
    this.toggleMoreStats = this.toggleMoreStats.bind(this)
    this.state = {
      display: false
    }
  }

  toggleMoreStats() {
    this.setState({
      display: !this.state.display
    })
  }

  getRaceCountData() {
    const { scoreHistory } = this.props.tournament
    let raceCounts = scoreHistory.map(player => (
      [ player.name, Object.keys(player.scores).length ]
    ))
    raceCounts.sort((a,b) => b[1] - a[1])
    let raceCountData = [["Player", "Race Count"]]
    raceCountData.push.apply(raceCountData, raceCounts.slice(1, 11))
    return raceCountData
  }

  getHighestAndLowestScores() {
    const { scoreHistory } = this.props.tournament
    let maxScore = -200
    let minScore = 99999999
    let maxScorePlayer = ""
    let minScorePlayer = ""
    scoreHistory.forEach(player => {
      if (player.name !== "_comp") {
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
    return [maxScore.toFixed(), maxScorePlayer, minScore.toFixed(), minScorePlayer]
  }

  render() {
    const { display } = this.state
    const { classes } = this.props
    const raceCountData = this.getRaceCountData()
    const highAndLow = this.getHighestAndLowestScores()

    return (
      <div>
        {display ?
          <div className={classes.moreStats}>
            <Typography variant='h4'>Stats</Typography>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={raceCountData}
              options={mostRacesChartOptions}
            />
            <div className={classes.bestAndWorst}>
              <Typography variant='h6'>Highest Score Ever - {highAndLow[1]}: {highAndLow[0]}</Typography>
              <Typography variant='h6'>Lowest Score Ever -  {highAndLow[3]}: {highAndLow[2]}</Typography>
            </div>
            <Button variant="contained" onClick={this.toggleMoreStats} color="primary">Less Stats</Button>
          </div> :
          <div className={classes.moreStats}>
            <Button variant="contained" onClick={this.toggleMoreStats} color="primary">More Stats</Button>
          </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(MoreStats)