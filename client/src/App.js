import React from "react";
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";

import "./App.css";
import { history } from "./helpers";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

function App() {
	return (
		<Router history={history}>
			<Routes>
				<Route exact path="/login" element={<Login />} />
				<Route exact path="/signup" element={<Signup />} />
			</Routes>
		</Router>
	);
}

export default App;
