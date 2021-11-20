import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import Main from "./components/pages/main/Main";
import "./global.scss";
import { AuthProvider } from "./useAuth";
import AuthRoute from "./components/AuthRoute";
import Intro from "./components/Intro";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Panel from "./components/pages/Panel";

const BaseLayout = (props) => {
	return (
		<Main>
			<Route component={Intro} exact path={`/`} />
			<Route component={RegisterForm} exact path={`/register`} />
			<Route component={LoginForm} exact path={`/login`} />
			<AuthRoute component={Panel} path={`/panel`} />
		</Main>
	);
};

function App() {
	return (
		<AuthProvider>
			<Router basename="/">
				<Switch>
					<Route path="/" component={BaseLayout} />
				</Switch>
			</Router>
		</AuthProvider>
	);
}

export default App;
