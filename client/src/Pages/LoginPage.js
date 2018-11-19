import React, { Component } from 'react'
import PropTypes from 'prop-types'
import  { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';

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

class LoginPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Typography variant='h5'>Login</Typography>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          href="/auth/google"
        >
          Google+
        </Button>
        </div>
    )
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(LoginPage)
