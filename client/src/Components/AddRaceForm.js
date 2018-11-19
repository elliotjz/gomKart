import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import Minimize from '@material-ui/icons/Minimize'
import Typography from '@material-ui/core/Typography'

import PlayerResult from './PlayerResult'

const formDataReset = {
  "player0": "", "player0Pos": "",
  "player1": "", "player1Pos": "",
  "player2": "", "player2Pos": "",
  "player3": "", "player3Pos": "",
  "player4": "", "player4Pos": "",
  "player5": "", "player5Pos": "",
  "player6": "", "player6Pos": "",
  "player7": "", "player7Pos": "",
  "player8": "", "player8Pos": "",
  "player9": "", "player9Pos": "",
  "player10": "", "player10Pos": "",
  "player11": "", "player11Pos": "",
}

const styles = theme => ({
  root: {
    display: 'block',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    width: '40px',
    height: '40px',
    margin: '0 5px',
  },
  buttonContainer: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
  },
  plusMinusContainer: {
    marginRight: '30px',
  },
  minimizeIcon: {
    marginBottom: '15px',
  },
  errorMessage: {
    color: 'red',
  },
  successMessage: {
    color: 'green',
  },
});

class AddRaceForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      numPlayers: 4,
      errorMessage: "",
      successMessage: "",
      formData: formDataReset,
    }
  }

  handleChange = event => {
    let formData = { ...this.state.formData, [event.target.name]: event.target.value }
    this.setState({ formData, successMessage: "" });
  }

  addPlayer = () => {
    let numPlayers = this.state.numPlayers
    numPlayers = numPlayers > 11 ? numPlayers : numPlayers + 1
    this.setState({ numPlayers })
  }

  removePlayer = () => {
    let numPlayers = this.state.numPlayers
    numPlayers = numPlayers < 2 ? numPlayers : numPlayers - 1
    this.setState({ numPlayers })
  }

  submitRace = () => {
    let raceResults = {}
    for (let i = 0; i < this.state.numPlayers; i++) {
      let name = this.state.formData["player" + i]
      let position = this.state.formData["player" + i + "Pos"]

      // Check that the name is valid
      let valid = this.validatePosition(name, position, raceResults)
      if (!valid) return
      raceResults[name] = position
    }
    this.setState({
      successMessage: "Sending...",
      formData: formDataReset
    })
  }

  validatePosition = (name, position, raceResults) => {
    // Check name is defined
    if (name === "") {
      this.setState({
        errorMessage: "Please complete all inputs.",
      })
      return false
    }

    // Check the player has a position
    if (position === "") {
      this.setState({
        errorMessage: "Every player must have a position",
      })
      return false
    }

    // Check if the player is not included twice
    if (raceResults.hasOwnProperty(name)) {
      this.setState({
        errorMessage: "Can't have a duplicate player."
      })
      return false
    }
    this.setState({
      errorMessage: "",
    })
    return true
  }

  render() {
    const { classes } = this.props;
    let playerResultList = []
    for (let i = 0; i < this.state.numPlayers; i++) {
      playerResultList.push(
        <PlayerResult
          players={this.props.players}
          player={this}
          handleChange={this.handleChange}
          name={"player" + i}
          selectedPlayer={this.state.formData["player" + i]}
          position={this.state.formData["player" + i + "Pos"]}
        />)
    }
    return (
      <form className={classes.root} autoComplete="off" onSubmit={e => e.preventDefault()}>
        {playerResultList}
        {this.state.Message !== "" &&
          <Typography class={classes.errorMessage}>
            {this.state.errorMessage}
          </Typography>
        }
        {this.state.successMessage !== "" &&
          <Typography class={classes.successMessage}>
            {this.state.successMessage}
          </Typography>
        }
        <div className={classes.buttonContainer}>
          <div className={classes.plusMinusContainer}>
            <Button
              variant="fab"
              color="primary"
              aria-label="Add"
              className={classes.button}
              onClick={this.addPlayer}
            >
              <AddIcon />
            </Button>
            <Button
              variant="fab"
              color="primary"
              aria-label="Add"
              className={classes.button}
              onClick={this.removePlayer}
            >
              <Minimize className={classes.minimizeIcon}/>
            </Button>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={this.submitRace}>
            Submit
          </Button>
        </div>
      </form>
    );
  }
}

AddRaceForm.propTypes = {
  classes: PropTypes.object.isRequired,
  players: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddRaceForm);