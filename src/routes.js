import React from "react";
import Layout from "./HOC/Layout";
import { Switch, Route } from "react-router-dom";

import Home from "./Components/Home/Home";
import SignIn from "./Components/Signin/SignIn";
import Dashboard from "./Components/Admin/Dashboard";
import PublicRoutes from "./Components/AuthRouts/PublicRoutes";
import PrivateRoutes from "./Components/AuthRouts/PrivateRoutes";
import AdminMatches from "./Components/Admin/Matches/AdminMatches";
import EditMatch from "./Components/Admin/Matches/EditMatch";
import AdminPlayers from "./Components/Admin/Players/AdminPlayers";
import EditPlayer from "./Components/Admin/Players/EditPlayer";
import Team from "./Components/Team/Team";
import Matches from "./Components/Matches/Matches";
import NotFound from "./Components/UI/NotFound";

const Routes = props => {
  return (
    <Layout check={props}>
      <Switch>
        <PrivateRoutes //42
          {...props}
          path="/admin_matches/edit_match/:id"
          exact
          component={EditMatch}
        />
        <PrivateRoutes //42
          {...props}
          path="/admin_matches/edit_match/"
          exact
          component={EditMatch}
        />
        <PrivateRoutes //42
          {...props}
          path="/admin_matches"
          exact
          component={AdminMatches}
        />
        <PrivateRoutes //42
          {...props}
          path="/admin_players"
          exact
          component={AdminPlayers}
        />
        <PrivateRoutes //42
          {...props}
          path="/admin_players/edit_player/:id"
          exact
          component={EditPlayer}
        />
        <PrivateRoutes //42
          {...props}
          path="/admin_players/edit_player"
          exact
          component={EditPlayer}
        />
        <PrivateRoutes //42
          {...props}
          path="/dashboard"
          exact
          component={Dashboard}
        />
        <PublicRoutes //42
          {...props}
          path="/sign_in"
          restricted={true}
          exact
          component={SignIn}
        />
        <PublicRoutes //42
          {...props}
          path="/the_team"
          restricted={false}
          exact
          component={Team}
        />
        <PublicRoutes //42
          {...props}
          path="/the_matches"
          restricted={false}
          exact
          component={Matches}
        />
        <PublicRoutes //42
          {...props}
          path="/"
          restricted={false}
          exact
          component={Home}
        />
        <PublicRoutes //42
          restricted={false}
          component={NotFound}
        />
      </Switch>
    </Layout>
  );
};

export default Routes;
