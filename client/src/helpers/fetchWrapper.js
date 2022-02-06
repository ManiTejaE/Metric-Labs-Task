import axios from "axios";
import { useRecoilState } from "recoil";

import { history } from ".";
import { authAtom } from "../state";

export { useFetchWrapper };

function useFetchWrapper() {
	const [auth, setAuth] = useRecoilState(authAtom);

	return request();

	function request() {
		return (requestOptions) => {
			return axios(requestOptions)
				.then(handleResponse)
				.catch((error) => {
					if (error.response) {
						if ([401, 403].includes(error.response.status)) {
							localStorage.clear();
							setAuth(null);
							window.location.reload();
							//history.push("/login");
						} else {
							throw error;
						}
					}
				});
		};
	}

	// helper functions

	function handleResponse(response) {
		if (response) {
			if (response.statusText !== "OK") {
				if ([401, 403].includes(response.status) && auth?.token) {
					// auto logout if 401 Unauthorized or 403 Forbidden response returned from api
					localStorage.clear();
					setAuth(null);
					history.push("/login");
				}

				// const error = response.detail;
				return response.data;
			}
			return response.data;
		}
		return "Something went wrong";
	}
}
