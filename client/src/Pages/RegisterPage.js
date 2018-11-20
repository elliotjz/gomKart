import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
})

class RegisterPage extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          href="/auth/google"
        >
          Register
        </Button>
        </div>
    )
  }
}

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(RegisterPage)
