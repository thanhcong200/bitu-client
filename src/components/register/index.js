import { useState } from "react";
import logo from "../../logo.svg";
import "bootstrap/dist/css/bootstrap.css";
import "../login/login.css";
import "../login/util.css";
import { api } from "../../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await api.handleRegister({ username, password });
    if (res.status !== 400) {
      history.push("/login");
    } else
      alert(
        "Username: minLength 6. Password need to minLength: 8, minNumbers: 1,minSymbols: 1, minUppercase: 1. For sample: 123456a@A"
      );
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <div className="login100-pic js-tilt" data-tilt>
            <img src={logo} alt="IMG" />
          </div>

          <form className="login100-form validate-form">
            <span className="login100-form-title">Create new account</span>

            <div
              className="wrap-input100 validate-input"
              data-validate="Valid email is required: ex@abc.xyz"
            >
              <input
                className="input100"
                type="text"
                name="email"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>

            <div
              className="wrap-input100 validate-input"
              data-validate="Password is required"
            >
              <input
                className="input100"
                type="password"
                name="pass"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>

            <div className="container-login100-form-btn">
              <button
                className="login100-form-btn"
                onClick={(e) => handleRegister(e)}
              >
                Register
              </button>
            </div>

            <div className="text-center p-t-136">
              <a className="txt2" href="/login">
                Login with account
                <i
                  className="fa fa-long-arrow-right m-l-5"
                  aria-hidden="true"
                ></i>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
