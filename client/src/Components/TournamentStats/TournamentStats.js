import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import BarChartIcon from '@material-ui/icons/BarChart'
import TournamentChart from './TournamentChart'
import Swings from './Swings'
import RacesPlayed from './RacesPlayed'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    backgroundColor: theme.palette.background.paper,
  },
})

class TournamentStats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabValue: 0,
    }
  }

  handleTabChange = (event, tabValue) => {
    this.setState({ tabValue })
  }

  render() {
    const { tabValue } = this.state
    const { classes, tournament, playerScores } = this.props

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            classes={{
              root: classes.tabsRoot,
            }}
            value={tabValue}
            onChange={this.handleTabChange}
            centered
          >
            <Tab icon={<BarChartIcon />} label="Scores" />
            <Tab icon={<BarChartIcon />} label="Swings" />
            <Tab icon={<BarChartIcon />} label="Played" />
            <Tab icon={<BarChartIcon />} label="Head To Head" />
          </Tabs>
        </AppBar>
        {tabValue === 0 && (
          <TabContainer>
            <div className={classes.tabContainer}>
              <TournamentChart
                tournament={tournament}
                playerScores={playerScores}
              />
            </div>
          </TabContainer>
        )}
        {tabValue === 1 && (
          <TabContainer>
            <div className={classes.tabContainer}>
              <Swings tournament={tournament} />
            </div>
          </TabContainer>
        )}
        {tabValue === 2 && (
          <TabContainer>
            <div className={classes.tabContainer}>
              <RacesPlayed tournament={tournament} />
            </div>
          </TabContainer>
        )}
        {tabValue === 3 && (
          <TabContainer>
            <div className={classes.tabContainer}>
              <Typography>Martin is a sack</Typography>
            </div>
          </TabContainer>
        )}
      </div>
    )
  }
}

TabContainer.propTypes = {
  children: PropTypes.object.isRequired,
}

TournamentStats.propTypes = {
  tournament: PropTypes.object.isRequired,
  playerScores: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TournamentStats)
