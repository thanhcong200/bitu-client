import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Chat from "./components/chat/chat";
import Login from "./components/login/index";
import Register from "./components/register/index";
import { socket } from "./utils/socket/index";

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
        {/* {isLogin ? <Chat /> : <Login />} */}
        {/* <Chat /> */}
        <Router>
          <Switch>
            {routes.map((route, index) =>
            (
              <Route
                key={index}
                path={route.path}
                // component={<Login />}
                component={route.component}

              ></Route>
            )
            )}


          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
