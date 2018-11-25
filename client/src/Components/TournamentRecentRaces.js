import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { colors, comparePos, compareRaces } from '../helpers'
import PlayerChips from './PlayerChips'
import RaceResult from './RaceResult'

const styles = {
  root: {

  },
}

class TournamentRecentRaces extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      races: null,
      error: ""
    }
  }

  componentWillMount() {
    this.getRecentRaces()
  }

  async getRecentRaces() {
    this.setState({
      loading: true
    })
    try {
      const params = this.props.location.search
      const url = `/api/get-races${params}`
      const res = await fetch(`/api/get-races${params}`)
      const resData = await res.json()
      const parsedRaces = this.parseRaces(resData.races)
      this.setState({
        loading: false,
        error: "",
        races: parsedRaces
      })
    } catch (err) {
      console.log(err)
      this.setState({
        error: "Error loading races",
        loading: false
      })
    }
  }

  parseRaces(races) {
    for (let i = 0; i < races.length; i++) {
      const places = races[i].places[0]
      let parsedPlaces = []
      Object.keys(places).forEach(name => {
        parsedPlaces.push({
          name: name,
          position: places[name]
        })
      })
      parsedPlaces.sort(comparePos)
      races[i].places = parsedPlaces
    }
    return races.sort(compareRaces)
  }
  
  render() {
    const { players, parsedData, classes } = this.props
    const { error, loading, races } = this.state
    const shouldDisplayRaces = races !== undefined && races !== null && races.length > 0
    // if (races) console.log(races[0].user)
    return (
      <div className={classes.root}>
        {(parsedData !== undefined && parsedData[0].length > 1) &&
          <div>
            <PlayerChips
              players={players}
              parsedData={parsedData}
              colors={colors}
            />
          </div>
        }
        <div>
          {error !== "" && <Typography>{error}</Typography>}
          {loading && <Typography>loading...</Typography>}
          {shouldDisplayRaces ?
            <div>
              {races.map(race =>
                <RaceResult race={race} />
              )}
            </div> :
            <Typography variant="p">
              You need to add race results to the tournament.
            </Typography>
          }
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(TournamentRecentRaces)
