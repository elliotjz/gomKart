import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Chart } from 'react-google-charts'
import Typography from '@material-ui/core/Typography'
import { Button } from '@material-ui/core'

import { colors } from '../helpers'
import PlayerChips from './PlayerChips'
import MoreStats from './MoreStats'

const styles = {
  root: {

  },
}

const chartOptions = {
  curveType: "none",
  legend: 'none',
  colors,
  chartArea: {width: '85%', height: '80%'},
  vAxis: { baseline: 200 }
}

const chartDomains = ['All', 400, 100, 50]

class TournamentChart extends Component {
  constructor(props) {
    super(props)
    this.changeDomain = this.changeDomain.bind(this)
    this.onChipClick = this.onChipClick.bind(this)
    this.state = {
      chartDomainIndex: 0,
      excludedPlayers: [],
      parsedTournament: null
    }
  }

  changeDomain(index) {
    const parsedTournament = this.parseTournament(index, null)
    this.setState({
      parsedTournament,
      chartDomainIndex: index,
    })
  }

  onChipClick(name) {
    let { excludedPlayers } = this.state
    if (excludedPlayers.includes(name)) {
      const index = excludedPlayers.indexOf(name)
      excludedPlayers.splice(index, 1)
    } else {
      excludedPlayers.push(name)
    }
    const parsedTournament = this.parseTournament(null, excludedPlayers)
    this.setState({
      parsedTournament,
      excludedPlayers
    })
  }

  parseTournament(chartDomainIndex, excludedPlayers) {
    const { tournament, playerScores } = this.props
    chartDomainIndex = chartDomainIndex || this.state.chartDomainIndex
    excludedPlayers = excludedPlayers || this.state.excludedPlayers
    let parsedColors = colors.slice()
    let colorsToRemove = []

    if (tournament && tournament.length !== {}) {
      let parsedData = [["Race"]]
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
      playerScores.forEach((playerScore, index) => {
        const name = playerScore[0]
        // exclude excluded players
        if (!excludedPlayers.includes(name) && name !== "_comp") {
          // get index of player
          const index = scoreHistory.findIndex(x =>
            x.name === playerScore[0]
          )
          const player = scoreHistory[index]
          parsedData[0].push(player.name)
          let lastResult = 0
          for (let i = 1; i < parsedData.length; i++) {
            if (player.scores.hasOwnProperty(parsedData[i][0].toString())) {
              lastResult = player.scores[parsedData[i][0].toString()]
            }
            parsedData[i].push(lastResult)
          }
        } else {
          if (name !== "_comp") {
            colorsToRemove.push(index)
          }
        }
      })
      for (let i = colorsToRemove.length - 1; i >= 0; i--) {
        parsedColors.splice(colorsToRemove[i], 1)
      }
      return [parsedData, parsedColors]
    }
  }

  componentDidMount() {
    this.setState({
      parsedTournament: this.parseTournament()
    })
  }

  render() {
    const { playerScores, tournament, classes } = this.props
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
        {parsedData !== undefined ?
          <div className={classes.root}>
            <PlayerChips
              playerScores={playerScores}
              colors={colors}
              onClick={this.onChipClick}
              excludedPlayers={excludedPlayers}
            />
            {parsedData[0].length > 1 &&
              <Chart
                chartType="LineChart"
                width="100%"
                height="600px"
                data={parsedData}
                options={chartOptions}
              />
            }
            {chartDomains.map((domain, index) =>
              <Button
                key={index}
                color="primary"
                size='small'
                variant={chartDomainIndex === index ? "outlined" : ""}
                onClick={() => this.changeDomain(index)}>
                {domain}
              </Button>
            )}
            <MoreStats tournament={tournament} playerScores={playerScores} />
          </div> :
          <div>
            <Typography variant="p">You need to add players to the tournament before you can see the chart</Typography>
          </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(TournamentChart)
