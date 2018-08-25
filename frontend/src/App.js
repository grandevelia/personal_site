import React, { Component } from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';

import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import {auth} from "./actions";
import myApp from './reducers';
import Layout from "./components/Layout";
import Home from "./components/Home";
import Portfolio from "./components/Portfolio";
import Blog from "./components/Blog";
import BlogHome from "./components/BlogHome";
import NotFound from "./components/NotFound";
import Login from "./components/Login";

import 'font-awesome/css/font-awesome.min.css';

let store = createStore(myApp, applyMiddleware(thunk))

class RootContainerComponent extends Component {
  componentDidMount() {
    this.props.loadUser();
  }
  render(){
    const portfolioComponents = ["","Web","Projects","Visual"];

    const portfolioRoutes = portfolioComponents.map((componentName)=>{
      return <Route exact path ={"/Portfolio/" + componentName} render={(props) => <Portfolio componentNames={portfolioComponents} displayType={componentName} {...props} />} key={componentName} />
    });

    return (
        <BrowserRouter>
          <Layout>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/Home/" component={Home} />
                <Route exact path="/Blog/" component={BlogHome} />
                <Route path="/Blog/" component={Blog} />
                <Route path="/Login/" component={Login} />
                {portfolioRoutes}
                <Route component={NotFound} />
            </Switch>
          </Layout>
        </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    loadUser: () => {
      return dispatch(auth.loadUser());
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