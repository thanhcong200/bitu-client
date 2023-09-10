import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Chat from "./components/chat/chat";
import Login from "./components/login/index";
import Register from "./components/register/index";

const routes = [
  {
    path: "/login",
    component: Login,
    name: "Login",
  },
  {
    path: "/register",
    component: Register,
    name: "Register",
  },
  {
    path: "/",
    component: Chat,
    name: "Home",
  },
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                component={route.component}
              ></Route>
            ))}
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
