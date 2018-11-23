import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { Button } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
  paper: {
    maxWidth: "350px",
    margin: "30px auto",
    padding: "20px",
  },
  buttonContainer: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
  },
  h4: {
    margin: '20px'
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  listLink: {
    textDecoration: 'none'
  },
  listItem: {
    textAlign: 'center',
  }
})

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tournaments: [],
      error: "",
      loading: true
    }
  }

  async getTournaments() {
    this.setState({ loading: true })
    try {
      const res = await fetch('/api/get-tournaments')
      const resData = await res.json()
      this.setState({
        tournaments: resData.tournaments,
        error: "",
        loading: false
      })
    } catch (err) {
      this.setState({
        error: "We're having trouble connecting to our server. Try again later.",
        loading: false
      })
    }
  }

  componentWillMount() {
    this.getTournaments()
  }

  render() {
    const { classes } = this.props
    const { tournaments, error, loading } = this.state
    return (
      <div>
        {error === "" ?
        <div>
          <Paper elevation="0" className={classes.paper}>
            <Typography variant="h5">Tournaments</Typography>
            {loading ?
              <CircularProgress className={classes.progress} /> :
              <div>
              {(tournaments && tournaments.length > 0) ?
                <List component="nav">
                  <Divider />
                  {tournaments.map((tournament, index) => {
                    const toLink = `/tournament?code=${tournament.code}`
                    return (
                      <Link key={index} to={toLink} className={classes.listLink}>
                        <ListItem button className={classes.listItem}>
                          <ListItemText primary={tournament.name} />
                        </ListItem>
                        <Divider />
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
        </div> :
        <div>
          <Typography variant="p" className={classes.h4}>
            {error}
          </Typography>
        </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(Home)
