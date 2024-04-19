import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { models } from "./actions";
import myApp from './reducers';
import Layout from "./components/Layout";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

let store = createStore(myApp, applyMiddleware(thunk))

class RootContainerComponent extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    models: state.models,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    fetchModel: () => {
      return dispatch(models.fetchModel());
    }
  }
}
let RootContainer = connect(mapStateToProps, mapDispatchToProps)(RootContainerComponent);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    );
  }
}