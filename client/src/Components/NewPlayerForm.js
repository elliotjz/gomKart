import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    display: 'block',
  },
  buttonContainer: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
  },
  errorMessage: {
    color: 'red',
  },
  successMessage: {
    color: 'green',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    marginTop: 19,
  },
});

class RaceInputForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: "",
      errorMessage: "",
      successMessage: "",
    }
  }

  handleChange = event => {
    this.setState({
      name: event.target.value,
      errorMessage: "",
      successMessage: "",
    })
  }

  submitNewPlayer = () => {
    if (this.state.name === "") {
      this.setState({ errorMessage: "Player names can't be empty"})
      return
    }
    this.setState({
      errorMessage: "",
      successMessage: "Sending...",
      name: "",
    })
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} autoComplete="off" onSubmit={e => e.preventDefault()}>
        <TextField
          id="name"
          label="Name"
          className={classes.textField}
          margin="dense"
          value={this.state.name}
          onChange={this.handleChange}
        />
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
          <Button
            variant="contained"
            color="primary"
            onClick={this.submitNewPlayer}>
            Submit
          </Button>
        </div>
      </form>
    );
  }
}

RaceInputForm.propTypes = {
  classes: PropTypes.object.isRequired,
  players: PropTypes.object.isRequired,
};

export default withStyles(styles)(RaceInputForm);