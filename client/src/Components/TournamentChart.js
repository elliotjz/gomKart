import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Chart } from 'react-google-charts'
import Typography from '@material-ui/core/Typography'
import { Button } from '@material-ui/core'

import { colors } from '../helpers'
import PlayerChips from './PlayerChips'

const styles = {
  root: {

  },
}

const chartOptions = {
  curveType: "none",
  legend: 'none',
  colors,
  chartArea: {width: '85%', height: '80%'}
}

const chartDomains = ['All', 400, 100, 50]

class TournamentChart extends Component {
  constructor(props) {
    super(props)
    this.changeDomain = this.changeDomain.bind(this)
    this.state = {
      chartDomainIndex: 100
    }
  }

  changeDomain(index) {
    this.setState({
      chartDomainIndex: index
    })

  }

  render() {
    const { players, parsedData, classes } = this.props
    const { chartDomainIndex } = this.state
    let dataToGraph = []
    const chartDomain = chartDomains[chartDomainIndex]
    if (chartDomainIndex !== 0 && chartDomain < parsedData.length) {
      const endIndex =  parsedData.length - 1
      const startIndex = endIndex - chartDomain
      dataToGraph.push(parsedData[0])
      dataToGraph.push.apply(dataToGraph, parsedData.slice(startIndex, endIndex))
    } else {
      dataToGraph = parsedData
    }

    return (
      <div>
        {(dataToGraph !== undefined && dataToGraph[0].length > 1) ?
          <div className={classes.root}>
              <PlayerChips
              players={players}
              parsedData={dataToGraph}
              colors={colors}
              />
            <Chart
              chartType="LineChart"
              width="100%"
              height="600px"
              data={dataToGraph}
              options={chartOptions}
            />
            {chartDomains.map((domain, index) =>
              <Button key={index} color="primary" onClick={() => this.changeDomain(index)}>
                {domain}
              </Button>
              )}
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
