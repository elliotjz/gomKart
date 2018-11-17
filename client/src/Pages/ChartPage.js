import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { Chart } from 'react-google-charts'

import RaceInputForm from '../Components/RaceInputForm'
import NewPlayerForm from '../Components/NewPlayerForm'

let dummyData = {
  lastRace: 11,
  playerHistory: [
  {
    "name": "EZ",
    "scoreHistory": {"1": 0,"2": 7,"3": 13,"5": 12,"6": 16,"11": 10}
  },
  {
    "name": "Martoon",
    "scoreHistory": {"1": 0,"3": 7,"4": 13,"5": 12,"9": 16,"10": 20}
  },
  {
    "name": "JLad",
    "scoreHistory": {"1": 0,"3": -4,"4": -6,"5": -8,"9": -12,"10": -12}
  },
  {
    "name": "Benton",
    "scoreHistory": {"1": 0,"2": -4,"5": -7,"6": -10,"9": -20,"11": -50}
  },
  ]
}

const options = {
  title: "Score History",
  curveType: "function",
  legend: { position: "bottom" }
};

const styles = {
  chartContainer: {
    width: "100%",
    margin: '20px auto',
  },
  formContainer: {
    maxWidth: "400px",
    margin: "30px auto",
    padding: "20px",
  },
  newPlayerBtn: {
    marginBottom: '50px',
  },
}

class ChartPage extends Component {

  state = {
    data: dummyData,
  }

  componentWillMount() {
    this.parseData();
  }

  componentDidMount() {
    // Get the passwords and store them in state
    fetch('/api')
      .then(res => res.json())
      .then(passwords => this.setState({ passwords }));
  }
 
  parseData = () => {
    let values = [["Race"]]
    let players = []

    for (let i = 0; i <= dummyData.lastRace; i++) {
      values.push([i.toString()])
    }

    dummyData.playerHistory.forEach(player => {
      players.push(player.name);
      values[0].push(player.name)
      let lastResult = 0
      for (let i = 1; i < values.length; i++) {
        if (player.scoreHistory.hasOwnProperty(values[i][0].toString())) {
          lastResult = player.scoreHistory[values[i][0].toString()]
        }
        values[i].push(lastResult);
      }
    })
    
    this.setState({ data: values, players: players })
  }

  render() {
    const { classes } = this.props;
    const { passwords } = this.state
    return (
      <div>
        {
          passwords !== undefined ? (
            <div>
            <h1>5 Passwords.</h1>
            <ul className="passwords">
              {passwords.map((password, index) =>
                <li key={index}>
                  {password}
                </li>
              )}
            </ul>
            <button
              className="more"
              onClick={this.getPasswords}>
              Get More
            </button>
            </div>
          ) :
          <p>no passwords :(</p>
          }
        <div className={classes.chartContainer}>
          <Chart
            chartType="LineChart"
            width="100%"
            height="600px"
            data={this.state.data}
            options={options}
          />
        </div>
        <Paper elevation="3" className={classes.formContainer}>
          <Typography variant="h5">Add New Race</Typography>
          <RaceInputForm
            players={this.state.players}
          />
        </Paper>
        <Paper elevation="3" className={classes.formContainer}>
          <Typography variant="h5">Add New Player</Typography>
          <NewPlayerForm />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(ChartPage);
