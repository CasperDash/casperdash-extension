import React, { Component } from 'react';
import autobind from 'react-autobind';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import modules from './modules';

import Page404 from './components/Page404';
import Layout from './components/Layout';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this._routes = null;
  }

  renderRoutes() {
    if (this._routes) {
      return this._routes;
    }

    this._routes = Object.keys(modules).map((item) => (
      <Route key={`route_${item}`} exact path={item} component={withRouter(modules[item])} />
    ));

    return this._routes;
  }
  
  render() {
    const routes = this.renderRoutes();

    return (
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <Switch>
              {routes}
              <Route component={Page404} />
            </Switch>
          </Layout>
        </BrowserRouter>
      </Provider>
    );
  }
}

