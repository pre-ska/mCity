import React from "react";
import { Route, Redirect } from "react-router-dom";

//ovo je ruta iz routes.js ... zbog test dali je admin logiran
const PrivateRoutes = ({
  user,
  component: Comp, // na ovaj način varijablu iz propsa mogu koristiti kao komponentu
  ...rest
}) => {
  return (
    <Route
      {...rest}
      component={routerProps =>
        user ? (
          <Comp {...routerProps} user={user} />
        ) : (
          <Redirect to="/sign_in" />
        )
      }
    />
  );
};

export default PrivateRoutes;
