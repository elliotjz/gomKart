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
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      value: 0
    }
  }

  handleChange(event, value) {
    this.setState({ value })
  }

  render() {
    const { players, parsedData, classes, addRaceCallback, addPlayerCallback, location } = this.props
    const { value } = this.state

    return (
      <div>
        <div className={classes.tabsRoot}>
          <AppBar position="static" color="default">
            <Tabs value={value} onChange={this.handleChange}>
            <Tab icon={<AddIcon />} />
            <Tab icon={<BarChartIcon />} />
            <Tab icon={<ListIcon />} />
            <Tab icon={<SettingsIcon />} />
            </Tabs>
          </AppBar>
          {value === 0 &&
          <TabContainer>
            <AddRaceForm
              players={players}
              addRaceCallback={addRaceCallback}
            />
            <AddPlayerForm addPlayerCallback={addPlayerCallback} players={players}/>
          </TabContainer>}
          {value === 1 &&
            <TabContainer>
              <TournamentChart players={players} parsedData={parsedData}/>
            </TabContainer>}
          {value === 2 &&
            <TabContainer>
              <TournamentRecentRaces
                players={players} 
                parsedData={parsedData}
                location={location}
              />
            </TabContainer>}
          {value === 3 && <TabContainer>Setting Coming Soon</TabContainer>}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(TournamentData)







