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
    }
  }

  handleChange = event => {
    this.setState({
      name: event.target.value,
    })
  }

  submitForm = () => {
    this.props.handleSubmit(this.state.name)
  }

  render() {
    const { classes } = this.props
    const { inputLabel, buttonLabel, errorMessage, loading } = this.props
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
        {errorMessage !== "" &&
          <Typography class={classes.errorMessage}>
            {errorMessage}
          </Typography>
        }
        {loading &&
          <Typography class={classes.successMessage}>
            Loading...
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
  buttonLabel: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
}

export default withStyles(styles)(SingleInputForm)
