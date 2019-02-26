import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { CircularProgress } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { Chart } from 'react-google-charts'

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  chartLoader: {
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
})

const chartOptions = {
  legend: 'none',
  pieSliceText: 'label',
  chartArea: { width: '85%', height: '85%' },
  colors: ['rgb(65, 148, 165)', 'rgb(218, 50, 52)', '#A9A9A9'],
  fontSize: 18,
  pieSliceTextStyle: { color: '#000' },
}

class HeadToHead extends Component {
  constructor(props) {
    super(props)
    this.state = {
      player1: '',
      player2: '',
      player1Wins: 0,
      player2Wins: 0,
      draws: 0,
      ELOPrediction: '',
      races: null,
      loading: true,
      error: '',
    }
  }

  componentDidMount() {
    this.getRaces()
  }

  async getRaces() {
    try {
      const params = this.props.location.search
      const res = await fetch(`/api/get-races${params}`)
      const resData = await res.json()
      if (!resData.error) {
        this.setState({
          error: '',
          races: resData.races,
          loading: false,
        })
        this.getHeadToHeadData()
      } else {
        this.setState({
          error: 'Error Loading Data',
          loading: false,
        })
      }
    } catch (err) {
      this.setState({
        error: 'Error Loading Data',
        loading: false,
      })
    }
  }

  getELOPrediction() {
    const SENSITIVITY = 250
    const { playerScores } = this.props
    const { player1, player2 } = this.state
    let player1Score
    let player2Score

    playerScores.forEach(player => {
      if (player[0] === player1) player1Score = parseInt(player[1])
      if (player[0] === player2) player2Score = parseInt(player[1])
    })

    const chanceOfWinning =
      1 / (1 + 10 ** ((player2Score - player1Score) / SENSITIVITY))
    const winPercentage = (chanceOfWinning * 100).toFixed()

    return player1Score > player2Score
      ? `${player1} will win ${winPercentage}% of the time`
      : `${player2} will win ${100 - winPercentage}% of the time`
  }

  getHeadToHeadData() {
    const { player1, player2, races } = this.state

    if (player1 !== '' && player2 !== '' && races !== null) {
      if (player1 === player2) {
        this.setState({ error: 'Choose 2 different players' })
        return
      }
      this.setState({ error: '' })

      let player1Wins = 0
      let player2Wins = 0
      let draws = 0
      races.forEach(race => {
        const places = race.places[0]
        const players = Object.keys(places)
        if (players.includes(player1) && players.includes(player2)) {
          const place1 = parseInt(places[player1])
          const place2 = parseInt(places[player2])
          if (place1 > place2) {
            player2Wins += 1
          } else if (place1 < place2) {
            player1Wins += 1
          } else {
            draws += 1
          }
        }
      })

      const ELOPrediction = this.getELOPrediction()

      this.setState({ player1Wins, player2Wins, draws, ELOPrediction })
    }
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState(
      {
        [name]: value,
      },
      () => this.getHeadToHeadData()
    )
  }

  render() {
    const { classes, playerScores } = this.props
    const {
      player1,
      player2,
      player1Wins,
      player2Wins,
      draws,
      ELOPrediction,
      loading,
      error,
    } = this.state

    const options = playerScores.map((item, index) => (
      <option key={index + 1} value={item[0]}>
        {item[0]}
      </option>
    ))
    options.unshift(<option key={0} value="" />)

    const loader = (
      <div className={classes.chartLoader}>
        <CircularProgress className={classes.loader} />
      </div>
    )

    const chartData = [
      ['Result', 'Count'],
      [player1.toUpperCase(), player1Wins],
      [player2.toUpperCase(), player2Wins],
      ['DRAWS', draws],
    ]

    return (
      <div>
        <div>
          <Typography variant="h4">Head To Head</Typography>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor={player1}>Player 1</InputLabel>
            <Select
              native
              value={player1}
              onChange={this.handleChange}
              inputProps={{
                name: 'player1',
                id: 'player1',
              }}
            >
              {options}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor={player2}>Player 2</InputLabel>
            <Select
              native
              value={player2}
              onChange={this.handleChange}
              inputProps={{
                name: 'player2',
                id: 'player2',
              }}
            >
              {options}
            </Select>
          </FormControl>
        </div>
        {player1 !== '' && player2 !== '' && player1 !== player2 && (
          <div>
            {loading ? (
              <CircularProgress />
            ) : (
              <div>
                {player1Wins === 0 && player2Wins === 0 && draws === 0 ? (
                  <Typography>
                    These players haven't races each other yet.
                  </Typography>
                ) : (
                  <Chart
                    chartType="PieChart"
                    width="100%"
                    height="400px"
                    data={chartData}
                    options={chartOptions}
                    loader={loader}
                  />
                )}
                <h3>GOM Kart Prediction</h3>
                <p>{ELOPrediction}</p>
              </div>
            )}
          </div>
        )}
        {error !== '' && error}
      </div>
    )
  }
}

HeadToHead.propTypes = {
  classes: PropTypes.object.isRequired,
  playerScores: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
}

export default withStyles(styles)(HeadToHead)
