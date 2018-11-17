import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    // display: 'block',
    // flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

class RegisterPage extends Component {
  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.registerUser = this.registerUser.bind(this)
    this.state = {
      username: null,
      email: null,
      password1: null,
      password2: null
    }
  }

  handleInputChange(event) {
    event.preventDefault()
    let key = event.target.name
    let value = event.target.value
    this.setState({
      [key]: value
    })
  }

  registerUser() {
    // event.preventDefault()
    let data = this.state

    let endpoint = ""

    let lookupOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }

    let production = window.location.href !== "http://localhost:3000/"
    if (production) {
      endpoint = 'https://gomkart-api.herokuapp.com/api/v1/rest-auth/registration/'
    } else {
      endpoint = 'http://127.0.0.1:8000/api/v1/rest-auth/registration/'
    }


    let thisComp = this

    
    fetch(endpoint, lookupOptions)
    .then(function(response) {
      return response.json()
    }).then(function(responseData) {
      console.log("success")
      console.log(responseData)
      thisComp.defaultState()
    }).catch(function(error) {
      console.log("error", error)
      console.log(error)
      alert("An error occurred.")
    })
  }

  defaultState() {
    this.setState({
      username: null,
      email: null,
      password1: null,
      password2: null
    })
  }
  
  render() {
    const { classes } = this.props;

    return (
      <form onSubmit={this.registerUser}>
        <fieldset>
          <div>
            <TextField
              label="Username"
              name="username"
              className={classes.textField}
              value={this.state.username}
              onChange={this.handleInputChange}
              margin="normal"
              required
            />
          </div>
          <div>
            <TextField
              label="Email Address"
              name="email"
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleInputChange}
              margin="normal"
              required
            />
          </div>
          <div>
            <TextField
              label="Password"
              name="password1"
              type="password"
              className={classes.textField}
              value={this.state.password1}
              onChange={this.handleInputChange}
              margin="normal"
              required
            />
          </div>
          <div>
            <TextField
            label="Confirm Password"
            name="password2"
            type="password"
            className={classes.textField}
            value={this.state.password2}
            onChange={this.handleInputChange}
            margin="normal"
            required
          />
          </div>
          <Button
            onClick={this.registerUser}
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
          >
            Register
          </Button>
        </fieldset>
      </form>
    )
  }
}

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
  uiConfig: PropTypes.object.isRequired,
}

export default withStyles(styles)(RegisterPage)
