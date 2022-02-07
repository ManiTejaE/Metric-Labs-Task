import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import RequireAuth from "./components/RequireAuth";
import { history } from "./helpers";
import { WithAxios } from "./helpers/withAxios";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

function App() {
	return (
		<Router history={history}>
			<WithAxios>
				<Routes>
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/signup" element={<Signup />} />
					<Route
						exact
						path="/home"
						element={
							<RequireAuth>
								<Home />
							</RequireAuth>
						}
					/>
					<Route path="/" element={<Navigate replace to="/home" />} />
				</Routes>
			</WithAxios>
		</Router>
	);
}

export default App;
