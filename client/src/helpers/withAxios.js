import { useMemo } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authAtom } from "../state";

export const WithAxios = ({ children }) => {
	const auth = useRecoilValue(authAtom);

	useMemo(() => {
		axios.interceptors.request.use(
			async (req) => {
				console.log(auth);
				if (auth != null) {
					req.headers.Authorization = "Bearer " + auth.token;
				}
				return req;
			},
			async (error) => {
				// pass
			}
		);

		axios.interceptors.response.use(
			(res) => {
				return res;
			},
			(error) => {
				throw error;
			}
		);
	}, [auth]);

	return children;
};
