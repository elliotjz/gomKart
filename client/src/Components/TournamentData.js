import React, { Component } from 'react'
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
import AddRaceForm from '../Components/AddRaceForm'
import AddPlayerForm from '../Components/AddPlayerForm'


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
    this.handleTabChange = this.handleTabChange.bind(this)
    this.deleteRace = this.deleteRace.bind(this)
    this.displayMoreRaces = this.displayMoreRaces.bind(this)
    this.state = {
      tabValue: 0,
      recentRacesLoading: true,
      recentRacesError: "",
      recentRacesBottomError: "",
      recentRacesPage: 1
    }
  }

  handleTabChange(event, tabValue) {
    this.setState({ tabValue })
  }

  async getRecentRaces(page) {
    this.setState({
      recentRacesLoading: true
    })
    try {
      let params = this.props.location.search
      params += "&page=" + page
      const res = await fetch(`/api/get-races${params}`)
      const resData = await res.json()
      if (!resData.error) {
        this.setState({
          recentRacesLoading: false,
          recentRacesError: ""
        })
        this.props.updatedRacesCallback(resData.races, page)
      } else {
        this.setState({
          recentRacesLoading: false,
          recentRacesError: "",
          recentRacesBottomError: "No more races to display"
        })
      }

    } catch (err) {
      this.setState({
        recentRacesError: "Error loading races",
        recentRacesLoading: false
      })
    }
  }

  displayMoreRaces() {
    const { recentRacesPage } = this.state
    this.getRecentRaces(recentRacesPage + 1)
    this.setState({
      recentRacesPage: recentRacesPage + 1
    })
  }

  async deleteRace(race) {
    this.setState({
      recentRacesLoading: true
    })
    try {
      const res = await fetch('/api/delete-race', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ raceID: race._id, tournamentCode: race.tournament })
      })
      const resData = await res.json()
      if (resData.error) {
        this.setState({
          recentRacesError: resData.error,
          recentRacesLoading: false,
        })
      } else {
        this.setState({
          recentRacesError: "",
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

  componentWillMount() {
    this.getRecentRaces(1)
  }

  render() {
    const {
      playerScores,
      parsedData,
      races,
      classes,
      updatedTournamentCallback,
      updatedRacesCallback,
      addPlayerCallback,
      location
    } = this.props
    const { tabValue, recentRacesError, recentRacesLoading, recentRacesBottomError } = this.state

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
          {tabValue === 0 &&
          <TabContainer>
            <AddRaceForm
              playerScores={playerScores}
              updatedRacesCallback={updatedRacesCallback}
              updatedTournamentCallback={updatedTournamentCallback}
            />
            <AddPlayerForm addPlayerCallback={addPlayerCallback} playerScores={playerScores}/>
          </TabContainer>}
          {tabValue === 1 &&
            <TabContainer>
              <TournamentChart playerScores={playerScores} parsedData={parsedData}/>
            </TabContainer>}
          {tabValue === 2 &&
            <TabContainer>
              <TournamentRecentRaces
                location={location}
                races={races}
                error={recentRacesError}
                recentRacesBottomError={recentRacesBottomError}
                loading={recentRacesLoading}
                deleteRace={this.deleteRace}
                displayMoreRaces={this.displayMoreRaces}
                
              />
            </TabContainer>}
          {tabValue === 3 && <TabContainer>Setting Coming Soon</TabContainer>}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(TournamentData)







