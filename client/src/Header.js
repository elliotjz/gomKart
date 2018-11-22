import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    margin: 10,
  },
}

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  componentWillMount() {
    this.getUser()
  }

  async getUser() {
    try {
      const res = await fetch('/api/profile')
      const resData = await res.json()
      if (resData !== undefined) {
        this.setState({
          user: resData.user
        })
      }
    } catch (err) {
      console.log("Error getting user data")
    }
  }

  render() {
    const { classes } = this.props
    const { user } = this.state

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <div>
              <Button color="inherit" href="/home">Home</Button>
            </div>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              GOM KART
            </Typography>
            {user ?
              <div className={classes.row}>
                  <Avatar
                    alt={user.username}
                    src={user.imageURL}
                    className={classes.avatar}
                  />
                  <Button color="inherit" href="/auth/logout">Logout</Button>
              </div>
              :
              <div className={classes.row}>
                <Button color="inherit" href="/login">Login</Button>
              </div>
            }
          </Toolbar>
        </AppBar>
      </div>
    )
  }   
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  logoutClick: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);