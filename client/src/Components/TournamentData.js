import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import BarChartIcon from '@material-ui/icons/BarChart'
import ListIcon from '@material-ui/icons/List'
import SettingsIcon from '@material-ui/icons/Settings'
import AddIcon from '@material-ui/icons/Add'

import TournamentChart from './TournamentChart'
import TournamentRecentRaces from './TournamentRecentRaces'
import AddRaceForm from './AddRaceForm'
import AddPlayerForm from './AddPlayerForm'
import Settings from './Settings'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

const styles = theme => ({
  tabsRoot: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
})

class TournamentData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabValue: 0,
      recentRacesLoading: true,
      recentRacesError: '',
      recentRacesBottomError: '',
      recentRacesPage: 1,
      loadingMoreRaces: false,
    }
  }

  componentWillMount() {
    this.getRecentRaces(1)
  }

  async getRecentRaces(page) {
    this.setState({
      recentRacesLoading: page === 1,
      loadingMoreRaces: page !== 1,
    })
    try {
      let params = this.props.location.search
      params += `&page=${page}`
      const res = await fetch(`/api/get-races${params}`)
      const resData = await res.json()
      if (!resData.error) {
        this.setState({
          recentRacesLoading: false,
          recentRacesError: '',
          loadingMoreRaces: false,
        })
        this.props.updatedRacesCallback(resData.races, page)
      } else {
        this.setState({
          recentRacesLoading: false,
          recentRacesError: '',
          recentRacesBottomError: 'No more races to display',
          loadingMoreRaces: false,
        })
      }
    } catch (err) {
      this.setState({
        recentRacesError: 'Error loading races',
        recentRacesLoading: false,
        loadingMoreRaces: false,
      })
    }
  }

  handleTabChange = (event, tabValue) => {
    this.setState({ tabValue })
  }

  displayMoreRaces = () => {
    const { recentRacesPage } = this.state
    this.getRecentRaces(recentRacesPage + 1)
    this.setState({
      recentRacesPage: recentRacesPage + 1,
    })
  }

  deleteRace = async race => {
    this.setState({
      recentRacesLoading: true,
    })
    try {
      const res = await fetch('/api/delete-race', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raceID: race._id,
          tournamentCode: race.tournament,
        }),
      })
      const resData = await res.json()
      if (resData.error) {
        this.setState({
          recentRacesError: resData.error,
          recentRacesLoading: false,
        })
      } else {
        this.setState({
          recentRacesError: '',
          recentRacesLoading: false,
        })
        this.props.updatedRacesCallback(resData.races)
        this.props.updatedTournamentCallback(resData.tournament)
      }
    } catch (err) {
      this.setState({
        recentRacesError: err,
        recentRacesLoading: false,
      })
    }
  }

  render() {
    const {
      playerScores,
      tournament,
      races,
      classes,
      updatedTournamentCallback,
      updatedRacesCallback,
      addPlayerCallback,
      location,
    } = this.props
    const {
      tabValue,
      recentRacesError,
      recentRacesLoading,
      recentRacesBottomError,
      loadingMoreRaces,
    } = this.state

    return (
      <div>
        <div className={classes.tabsRoot}>
          <AppBar position="static" color="default">
            <Tabs value={tabValue} onChange={this.handleTabChange}>
              <Tab icon={<AddIcon />} />
              <Tab icon={<BarChartIcon />} />
              <Tab icon={<ListIcon />} />
              <Tab icon={<SettingsIcon />} />
            </Tabs>
          </AppBar>
          {tabValue === 0 && (
            <TabContainer>
              <div>
                <AddRaceForm
                  playerScores={playerScores}
                  updatedRacesCallback={updatedRacesCallback}
                  updatedTournamentCallback={updatedTournamentCallback}
                />
                <AddPlayerForm
                  addPlayerCallback={addPlayerCallback}
                  playerScores={playerScores}
                />
              </div>
            </TabContainer>
          )}
          {tabValue === 1 && (
            <TabContainer>
              <TournamentChart
                playerScores={playerScores}
                tournament={tournament}
              />
            </TabContainer>
          )}
          {tabValue === 2 && (
            <TabContainer>
              <TournamentRecentRaces
                location={location}
                races={races}
                error={recentRacesError}
                recentRacesBottomError={recentRacesBottomError}
                loading={recentRacesLoading}
                deleteRace={this.deleteRace}
                displayMoreRaces={this.displayMoreRaces}
                loadingMoreRaces={loadingMoreRaces}
              />
            </TabContainer>
          )}
          {tabValue === 3 && (
            <TabContainer>
              <Settings
                playerScores={playerScores}
                updatedRacesCallback={updatedRacesCallback}
                updatedTournamentCallback={updatedTournamentCallback}
              />
            </TabContainer>
          )}
        </div>
      </div>
    )
  }
}

TabContainer.propTypes = {
  children: PropTypes.object.isRequired,
}

TournamentData.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  updatedRacesCallback: PropTypes.func.isRequired,
  updatedTournamentCallback: PropTypes.func.isRequired,
  addPlayerCallback: PropTypes.func.isRequired,
  playerScores: PropTypes.array.isRequired,
  tournament: PropTypes.object.isRequired,
  races: PropTypes.array.isRequired,
}

export default withStyles(styles)(TournamentData)
