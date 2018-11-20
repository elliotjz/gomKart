import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { Button } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import StarIcon from '@material-ui/icons/Star';

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

  getTournaments() {
    fetch('/api/get-tournaments')
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      }
    })
    .then((resData) => {
      this.setState({
        tournaments: resData.tournaments
      })
    })
  }

  componentWillMount() {
    this.getTournaments()
  }

  render() {
    const { classes } = this.props
    const { tournaments } = this.state
    return (
      <div>
        <Paper elevation="3" className={classes.paper}>
          <Typography variant="h5">Tournaments</Typography>
          {tournaments.length > 0 ?
            <List component="nav">
              {tournaments.map((tournament, index) => {
                const toLink = `/tournament?code=${tournament.code}`
                return (
                  <Link key={index} to={toLink}>
                    <ListItem button>
                      <ListItemIcon>
                        <StarIcon />
                      </ListItemIcon>
                      <ListItemText primary={tournament.name} />
                    </ListItem>
                  </Link>
                )
              })}
            </List>:
            <div>
              <Typography variant="p">
                You don't have any tournaments yet.
              </Typography>
            </div>
          }
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
        </Paper>        
      </div>
    )
  }
}

export default withStyles(styles)(Home)
