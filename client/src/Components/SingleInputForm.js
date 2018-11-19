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

class SingleInputForm extends React.Component {

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

  submitForm = () => {
    if (this.state.name === "") {
      this.setState({ errorMessage: "Player names can't be empty"})
      return
    }
    this.props.handleSubmit(this.state.name)
    this.setState({
      errorMessage: "",
      successMessage: "Sending...",
      name: "",
    })
  }

  render() {
    const { classes } = this.props
    const { inputLabel, buttonLabel } = this.props
    return (
      <form className={classes.root} autoComplete="off" onSubmit={e => e.preventDefault()}>
        <TextField
          id="name"
          label={inputLabel}
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
            onClick={this.submitForm}>
            {buttonLabel}
          </Button>
        </div>
      </form>
    );
  }
}

SingleInputForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  inputLabel: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired
}

export default withStyles(styles)(SingleInputForm)
