import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  root: {
    display: 'block',
  },
  buttonContainer: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.primary.dark,
  },
  errorMessage: {
    color: theme.palette.error.dark,
  },
  successMessage: {
    color: theme.palette.common.success,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    marginTop: 19,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  progressContainer: {
    display: 'flex',
    margin: 'auto',
    justifyContent: 'center',
  },
})

const SingleInputForm = ({
  classes,
  inputLabel,
  buttonLabel,
  errorMessage,
  successMessage,
  loading,
  handleChange,
  handleSubmit,
  value,
}) => (
  <form
    className={classes.root}
    autoComplete="off"
    onSubmit={e => {
      e.preventDefault()
      handleSubmit()
    }}
  >
    <TextField
      id="name"
      label={inputLabel}
      className={classes.textField}
      margin="dense"
      value={value}
      onChange={handleChange}
    />
    {loading ? (
      <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress} />
      </div>
    ) : (
      <div>
        {errorMessage !== '' && (
          <Typography className={classes.errorMessage}>
            {errorMessage}
          </Typography>
        )}
        {successMessage !== '' && (
          <Typography className={classes.successMessage}>
            {successMessage}
          </Typography>
        )}
      </div>
    )}

    <div className={classes.buttonContainer}>
      <Button color="inherit" type="submit">
        {buttonLabel}
      </Button>
    </div>
  </form>
)

SingleInputForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  inputLabel: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  successMessage: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

export default withStyles(styles)(SingleInputForm)
