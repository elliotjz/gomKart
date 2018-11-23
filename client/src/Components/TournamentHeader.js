
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  container: {
    backgroundColor: '#eee',
    padding: '20px 0px 40px 0px'
  },
  text: {
    margin: '20px'
  },
  shareCode: {
    color: '#666',
    fontSize: '18px'
  },
})

const TournamentHeader = ({ name, code, classes }) => (
  <div className={classes.container}>
    <Typography variant="h4" className={classes.text}>{name}</Typography>
    <Typography variant="h6" className={classes.shareCode}>Share Code: {code}</Typography>
  </div>
)

export default withStyles(styles)(TournamentHeader)
