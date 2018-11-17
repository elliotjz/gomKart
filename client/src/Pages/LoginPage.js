/*import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

function LoginPage(props) {
  const { classes } = props;

  return (
    <div>
      <div className={classes.root}>
        <StyledFirebaseAuth
          uiConfig={props.uiConfig}
          firebaseAuth={props.authenticate}  
        />
      </div>
    </div>
  )
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  uiConfig: PropTypes.object.isRequired,
  firebaseAuth: PropTypes.func.isRequired,
}

export default withStyles(styles)(LoginPage)
*/