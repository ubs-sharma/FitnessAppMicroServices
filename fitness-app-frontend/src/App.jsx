import { Box, Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";

import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { setCredentials } from "./store/authSlice";
import { useDispatch } from "react-redux";
import ActivityList from "./components/ActivityList";
import ActivityForm from "./components/ActivityForm";
import ActivityDetails from "./components/ActivityDetails";

const ActivitiesPage = () => {
  return (
    <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
      <ActivityForm onActityAdded={() => window.location.reload()} />
      <ActivityList />
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } =
    useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <Button
          variant="contained"
          color="#dc004e"
          onClick={() => {
            logIn();
          }}
        >
          LOGIN
        </Button>
      ) : (
        <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
          <Routes>
            <Route>
              <Route
                path="/"
                element={
                  token ? (
                    <Navigate to="/activities" replace />
                  ) : (
                    <div>Welcome!. Please log in</div>
                  )
                }
              />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/:id" element={<ActivityDetails />} />
              <Route path="/activity" element={<ActivityList />} />
            </Route>
          </Routes>
        </Box>
      )}
    </Router>
  );
}

export default App;
