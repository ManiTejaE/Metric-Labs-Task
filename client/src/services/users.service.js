import { useRecoilState, useSetRecoilState } from "recoil";
import { useFetchWrapper } from "../helpers";
import { authAtom, userAtom } from "../state";
import { useNavigate } from "react-router-dom";

export { useUserService };

function useUserService() {
	const baseUrl = process.env.REACT_APP_SERVER_URL;
	const fetchWrapper = useFetchWrapper();
	const [auth, setAuth] = useRecoilState(authAtom);
	const setUser = useSetRecoilState(userAtom);
	const navigate = useNavigate();

	return {
		signup,
		login,
		logout,
		getUser,
	};

	function signup(first_name, last_name, email, password) {
		const requestOptions = {
			method: "post",
			url: `${baseUrl}/auth/signup`,
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				first_name,
				last_name,
				email,
				password,
			},
		};

		return fetchWrapper(requestOptions).then((res) => {
			localStorage.setItem("metrictaskauth", JSON.stringify({ token: res.token }));
			setAuth(res.token);
			getUser(res.token);
			navigate("/home");
		});
	}

	function login(email, password) {
		const requestOptions = {
			method: "post",
			url: `${baseUrl}/auth/login`,
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				email,
				password,
			},
		};

		return fetchWrapper(requestOptions).then((res) => {
			localStorage.setItem("metrictaskauth", JSON.stringify({ token: res.token }));
			setAuth(res);
			getUser(res.token);
			navigate("/home");
		});
	}

	function logout() {
		// remove user from local storage, set auth state to null and redirect to login page
		localStorage.clear();
		setAuth(null);
		window.location.reload();
	}

	function getUser(token) {
		auth?.token && (token = auth?.token);
		const requestOptions = {
			method: "get",
			url: `${baseUrl}/user/me`,
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		};

		return fetchWrapper(requestOptions).then((res) => {
			setUser(res);
			return res;
		});
	}
}
