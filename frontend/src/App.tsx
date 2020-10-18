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
import { ThemeProvider } from "@material-ui/core";
import Theme from "./components/Theme";
function App() {
  return (
    <Router>
      <ThemeProvider theme={Theme}>
        <Switch>
          <Route
            exact
            path="/"
            component={
              Cookies.get("user") ? AuthorizedApp : UnauthorizedApp
            }
          />
          <Route exact path="/authorize" component={Authorize} />
          <Route component={AuthorizedApp} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
