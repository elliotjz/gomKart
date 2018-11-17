import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

function RegisterPage(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      Register
    </div>
  )
}

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(RegisterPage)
