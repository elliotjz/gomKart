import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    display: 'block',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class PlayerResult extends React.Component {
  render() {
    const { classes } = this.props;

    let options = []
    options.push(<option value="" />)
    if (this.props.players) {
      this.props.players.forEach(player => {
        options.push(<option value={player}>{player}</option>)
      })
    }

    let positions = []
    positions.push(<option value="" />)
    for (let i = 1; i <= 12; i++) {
      positions.push(<option value={i}>{i}</option>)
    }

    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={this.props.name}>Player</InputLabel>
          <Select
            native
            value={this.props.selectedPlayer}
            onChange={this.props.handleChange}
            inputProps={{
              name: this.props.name,
              id: this.props.name,
            }}
          >
            {options}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={this.props.name + "Pos"}>Position</InputLabel>
          <Select
            native
            value={this.props.position}
            onChange={this.props.handleChange}
            inputProps={{
              name: this.props.name + "Pos",
              id: this.props.name + "Pos",
            }}
          >
            {positions}
          </Select>
        </FormControl>
      </div>
    );
  }
}

PlayerResult.propTypes = {
  classes: PropTypes.object.isRequired,
  players: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedPlayer: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default withStyles(styles)(PlayerResult);





