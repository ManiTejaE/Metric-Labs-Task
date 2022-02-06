import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../state";

const RequireAuth = ({ children }) => {
	const auth = useRecoilValue(authAtom);
	return auth ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
