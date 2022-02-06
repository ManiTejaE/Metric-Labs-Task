import React, { useState } from "react";
import { useUserService } from "../../services/users.service";

import "./signup.styles.scss";

const Signup = () => {
	const [data, setData] = useState({});
	const [error, setError] = useState({});

	const userService = useUserService();

	const handleInputChange = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const validateForm = () => {
		let hasErrors = false;
		let errors = {};

		if (!data.firstName) {
			hasErrors = true;
			errors = { ...errors, firstName: "Please enter your name" };
		} else {
			errors = { ...errors, password: "" };
		}

		if (!/^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(data.email)) {
			hasErrors = true;
			errors = { ...errors, email: "Invalid Email Format." };
		} else {
			errors = { ...errors, email: "" };
		}

		if (!data.password) {
			hasErrors = true;
			errors = { ...errors, password: "Password cannot be empty." };
		} else {
			if (data.password !== data.confirmPassword) {
				hasErrors = true;
				errors = { ...errors, password: "Passwords does not match." };
			} else {
				errors = { ...errors, password: "" };
			}
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
			userService.signup(data.fullName, data.lastName, data.email, data.password).then((res) => {
				console.log(res);
				setData({
					...data,
					isSubmitting: false,
				}).catch((e) => {
					console.log(e);
					setData({
						...data,
						isSubmitting: false,
					});
					setError({ ...error, global: "Something went wrong." });
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
		<div className="signup">
			<div className="form-card card">
				<h1 className="m-auto">Sign Up!</h1>
				<form action="" onSubmit={handleFormSubmit}>
					<div className="inputs-container">
						<div className="input my-3">
							<div className="col-12 row me-0">
								<div className="col-6">
									<label htmlFor="signup_first_name">First Name</label>
									<div className="input-group">
										<span className="input-group-text">
											<i className="bi bi-person"></i>
										</span>
										<input id="signup_first_name" className="form-control" type="text" name="firstName" value={data.firstName} onChange={handleInputChange} required />
									</div>
									<small className="text-danger">{error.firstName}</small>
								</div>
								<div className="col-6 pe-0">
									<label htmlFor="signup_last_name">Last Name</label>
									<div className="input-group">
										<span className="input-group-text">
											<i className="bi bi-person"></i>
										</span>
										<input id="signup_last_name" className="form-control" type="text" name="lastName" value={data.lastName} onChange={handleInputChange} />
									</div>
								</div>
							</div>
						</div>
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
						<div className="input mb-3">
							<label htmlFor="login_password">Password</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-key"></i>
								</span>
								<input id="login_password" className="form-control" type="password" name="password" value={data.password} onChange={handleInputChange} required />
							</div>
							<small className="text-danger">{error.password}</small>
						</div>
						<div className="input mb-3">
							<label htmlFor="login_confirm_password">Confirm Password</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-key"></i>
								</span>
								<input id="login_confirm_password" className="form-control" type="password" name="confirmPassword" value={data.confirmPassword} onChange={handleInputChange} required />
							</div>
						</div>
					</div>
					<small className="text-danger">{error.global}</small>
					<button type="submit" className="btn btn-primary m-auto" disabled={data.isSubmitting}>
						Login
					</button>
					{data.errorMessage && <span className="form-error">{data.errorMessage}</span>}
				</form>
			</div>
		</div>
	);
};

export default Signup;
