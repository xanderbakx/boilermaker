import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import { UserHome } from './components';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/home" component={UserHome} />
      </Switch>
    );
  }
}

export default Routes;
