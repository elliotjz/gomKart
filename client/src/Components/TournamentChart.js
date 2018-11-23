import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Chart } from 'react-google-charts'
import Typography from '@material-ui/core/Typography'

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

const TournamentChart = ({ players, parsedData, classes }) => (
  <div>
    {(parsedData !== undefined && parsedData[0].length > 1) ?
      <div className={classes.root}>
          <PlayerChips
          players={players}
          parsedData={parsedData}
          colors={colors}
          />
        <Chart
          chartType="LineChart"
          width="100%"
          height="600px"
          data={parsedData}
          options={chartOptions}
        />
      </div> :
      <div>
        <Typography variant="p">You need to add players to the tournament before you can see the chart</Typography>
      </div>
    }
  </div>
)

export default withStyles(styles)(TournamentChart)
