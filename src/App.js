import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { socket } from "./utils/socket/index";
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
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isLogin, setIsLogin] = useState(false);

  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    if (accessToken) setIsLogin(true);
    // localStorage.removeItem("accessToken");
  }, [accessToken]);

  return (
    <div className="App">
      <header className="App-header">
        {isLogin ? <Chat /> : <Login />}
        {/* <Chat /> */}
        {/* <Router>
          <div>
            <nav>
              <ul>
                {routes.map((route, index) => {
                  return (
                    <li>
                      <Link to={route.path}> {route.name}</Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

          <Switch>
            {routes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  Component={route.component}
                ></Route>
              );
            })}
          </Switch>
          </div>
        </Router> */}
      </header>
    </div>
  );
}

export default App;
