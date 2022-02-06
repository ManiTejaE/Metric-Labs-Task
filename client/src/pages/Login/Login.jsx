import React, { useState } from "react";

import "./login.styles.scss";

const Login = () => {
	const initialState = {
		email: "",
		password: "",
		isSubmitting: false,
		errorMessage: null,
	};

	const [data, setData] = useState(initialState);

	const handleInputChange = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setData({
			...data,
			isSubmitting: true,
		});
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
								<span class="input-group-text">
									<i className="bi bi-envelope"></i>
								</span>
								<input id="login_email" className="form-control" type="email" name="email" value={data.email} onChange={handleInputChange} />
							</div>
						</div>
						<div className="input input-group mb-3">
							<label htmlFor="login_password">Password</label>
							<div className="input-group">
								<span class="input-group-text">
									<i className="bi bi-key"></i>
								</span>
								<input id="login_password" className="form-control" type="password" name="password" value={data.password} onChange={handleInputChange} />
							</div>
						</div>
					</div>
					<button type="submit" className="btn btn-primary" disabled={data.isSubmitting}>
						Login
					</button>
					{data.errorMessage && <span className="form-error">{data.errorMessage}</span>}
				</form>
			</div>
		</div>
	);
};

export default Login;
