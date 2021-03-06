import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

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

class NotFound extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <h1>404 Not Found</h1>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          href="/"
        >
          Home
        </Button>
      </div>
    )
  }
}

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(NotFound)
