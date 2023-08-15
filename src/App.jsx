import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { history } from "_helpers";
import { Nav, Alert, PrivateRoute } from "_components";
import { Home } from "home";
import { AccountLayout } from "account";
import { UsersLayout } from "users";
import { Audit } from "audit/Audit";
import { useSelector, useDispatch } from "react-redux";
export { App };

function App() {
  const auth = useSelector((x) => x.auth.value);
  // init custom history object to allow navigation from
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

  const changeRoute = () => {
    if (auth) {
      if (auth.role == "Auditor") {
        return <Navigate replace to="/audit" />;
      } else {
        return <Home />;
      }
    }
  };

  return (
    <div className="app-container bg-light">
      <Nav />
      <Alert />
      <div className="container pt-4 pb-4">
        <Routes>
          {/* private */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={changeRoute()} />
            <Route path="users/*" element={<UsersLayout />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/audit" element={<Audit />} />
          </Route>
          {/* public */}
          <Route path="account/*" element={<AccountLayout />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
