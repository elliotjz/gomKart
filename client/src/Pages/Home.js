import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { Button } from '@material-ui/core';

const styles = {
  chartContainer: {
    width: "100%",
    margin: '20px auto',
  },
  paper: {
    maxWidth: "400px",
    margin: "30px auto",
    padding: "20px",
  },
  buttonContainer: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
  },
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tournaments: []
    }
  }

  render() {
    const { classes } = this.props;
    const { tournaments } = this.state
    return (
      <div>
          <Paper elevation="3" className={classes.paper}>
            <Typography variant="h5">Tournaments</Typography>
            {tournaments.length > 0 ?
              <ul>
                {tournaments.map((tournament, index) => 
                  <li key={index}>{tournament.name}</li>
                )}
              </ul>:
              <div>
                <Typography variant="p">
                  You don't have any tournaments yet.
                </Typography>
                <div className={classes.buttonContainer}>
                  <Link to="/new"><Button
                    variant="contained"
                    color="primary"
                  >New Tournament</Button></Link>
                </div>
                <div className={classes.buttonContainer}>
                  <Link to="/join"><Button
                    variant="contained"
                    color="primary"
                  >Join Tournament</Button></Link>
                </div>
              </div>
            }
          </Paper>        
      </div>
    )
  }
}

export default withStyles(styles)(Home);
