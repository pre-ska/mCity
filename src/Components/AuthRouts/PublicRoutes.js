import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoutes = ({ user, component: Comp, ...rest }) => {
  return (
    <Route
      {...rest}
      component={routerProps =>
        rest.restricted ? (
          user ? (
            <Redirect to="/dashboard" />
          ) : (
            <Comp {...routerProps} user={user} />
          )
        ) : (
          <Comp {...routerProps} user={user} />
        )
      }
    />
  );
};

export default PublicRoutes;
