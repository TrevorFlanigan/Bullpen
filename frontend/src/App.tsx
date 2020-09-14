import React from "react";
import LoginButton from "./components/LoginButton";
import "./styles/App.css";
import "./styles/Parallax.css";
import Cookies from "js-cookie";
import Spotify from "./util/Spotify";
import LogoutButton from "./components/LogoutButton";
import Authorize from "./components/Authorize";
import AuthorizedApp from "./components/AuthorizedApp";
import Page404 from "./components/Page404";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UnauthorizedApp from "./components/UnauthorizedApp";
function App() {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          component={
            Cookies.get("accessToken") ? AuthorizedApp : UnauthorizedApp
          }
        />
        <Route exact path="/authorize" component={Authorize} />
        <Route component={AuthorizedApp} />
      </Switch>
    </Router>
  );
}

export default App;