import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = {
  container: {
    backgroundColor: '#eee',
    padding: '20px 0px 40px 0px',
  },
  text: {
    margin: '20px',
  },
  shareCode: {
    color: '#666',
    fontSize: '18px',
  },
}

const TournamentHeader = ({ name, code, classes }) => (
  <div className={classes.container}>
    <Typography variant="h4" className={classes.text}>
      {name}
    </Typography>
    <Typography variant="h6" className={classes.shareCode}>
      Share Code: {code}
    </Typography>
  </div>
)

TournamentHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
}

export default withStyles(styles)(TournamentHeader)
