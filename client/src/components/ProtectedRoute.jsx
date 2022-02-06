import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../state";

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const auth = useRecoilValue(authAtom);
	return (
		<Route
			{...rest}
			render={(props) => {
				if (!auth) {
					// not logged in so redirect to login page
					return (
						<Navigate
							to={{
								pathname: "/login",
								state: { from: props.location },
							}}
						/>
					);
				}

				// authorized - return component
				return <Component {...props} />;
			}}
		/>
	);
};

export default ProtectedRoute;
