import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../useAuth";

const AuthRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isAuthenticating } = useAuth();

  return isAuthenticated ? (
    <Route {...rest} render={(props) => <Component {...props} />} />
  ) : isAuthenticating ? (
    "null"
  ) : (
    <Redirect to="/" />
  );
};

export default AuthRoute;
