import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { history } from "../../helpers";
import { useUserService } from "../../services";
import { authAtom } from "../../state";

import "./login.styles.scss";

const Login = () => {
	const initialState = {
		email: "",
		password: "",
		isSubmitting: false,
		errorMessage: null,
	};

	const [data, setData] = useState(initialState);
	const [error, setError] = useState({});
	const auth = useRecoilValue(authAtom);
	const navigate = useNavigate();
	const userService = useUserService();

	useEffect(() => {
		if (auth) {
			history.push("/home");
		}
	}, [auth]);

	const handleInputChange = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const validateForm = () => {
		let hasErrors = false;
		let errors = {};

		if (!/^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(data.email)) {
			hasErrors = true;
			errors = { ...errors, email: "Invalid Email Format." };
		} else {
			errors = { ...errors, email: "" };
		}

		if (!data.password || data["password"].length < 4) {
			hasErrors = true;
			errors = { ...errors, password: "Password should be of atleast 4 characters." };
		} else {
			errors = { ...errors, password: "" };
		}

		setError(errors);
		return !hasErrors;
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setData({
			...data,
			isSubmitting: true,
		});

		if (validateForm()) {
			userService
				.login(data.email, data.password)
				.then((res) => {
					setData({
						...data,
						isSubmitting: false,
					});
					history.push("/home");
				})
				.catch((e) => {
					setData({
						...data,
						isSubmitting: false,
					});
				});
		} else {
			setData({
				...data,
				isSubmitting: false,
			});
		}
	};

	return (
		<div className="login">
			<div className="form-card card">
				<h1 className="m-auto">Login!</h1>
				<form action="" onSubmit={handleFormSubmit}>
					<div className="inputs-container">
						<div className="input mb-3">
							<label htmlFor="login_email">Email</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-envelope"></i>
								</span>
								<input id="login_email" className="form-control" type="email" name="email" value={data.email} onChange={handleInputChange} required />
							</div>
							<small className="text-danger">{error.email}</small>
						</div>
						<div className="input input-group mb-3">
							<label htmlFor="login_password">Password</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-key"></i>
								</span>
								<input id="login_password" className="form-control" type="password" name="password" value={data.password} onChange={handleInputChange} required />
							</div>
							<small className="text-danger">{error.password}</small>
						</div>
					</div>
					<small className="text-danger">{error.global}</small>
					<div className="m-auto" style={{ width: "fit-content" }}>
						<button type="submit" className="btn btn-primary me-3" disabled={data.isSubmitting}>
							Login
						</button>
						<button type="button" className="btn btn-success" onClick={() => navigate("/signup")} disabled={data.isSubmitting}>
							Sign Up
						</button>
					</div>
					{data.errorMessage && <span className="form-error">{data.errorMessage}</span>}
				</form>
			</div>
		</div>
	);
};

export default Login;
