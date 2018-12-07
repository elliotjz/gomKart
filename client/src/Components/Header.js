import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'

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
  render() {
    const { classes, user, isLoggedIn, loading } = this.props
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <div>
              <Button component={Link} to="/" color="inherit">
                Home
              </Button>
            </div>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              GOM KART
            </Typography>
            {!loading && (
              <div>
                {isLoggedIn && (
                  <div className={classes.row}>
                    <Avatar
                      alt={user.username}
                      src={user.imageURL}
                      className={classes.avatar}
                    />
                    <Button color="inherit" href="/auth/logout">
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  isLoggedIn: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default withStyles(styles)(Header)
