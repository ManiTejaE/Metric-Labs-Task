import { useRecoilState, useSetRecoilState } from "recoil";
import { history, useFetchWrapper } from "../helpers";
import { authAtom, userAtom } from "../state";

export { useUserService };

function useUserService() {
	const baseUrl = process.env.REACT_APP_SERVER_URL;
	const fetchWrapper = useFetchWrapper();
	const [auth, setAuth] = useRecoilState(authAtom);
	const setUser = useSetRecoilState(userAtom);

	return {
		signup,
		login,
		getUser,
	};

	function signup(first_name, last_name, email, password) {
		console.log(baseUrl);
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
			localStorage.setItem("auth", JSON.stringify({ token: res.token }));
			setAuth(res.token);
			getUser(res.token);
			history.push("/home");
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
			localStorage.setItem("auth", JSON.stringify({ token: res.token }));
			setAuth(res.token);
			getUser(res.token);
			const { from } = history.location.state || {
				from: { pathname: "/home" },
			};
			history.push(from);
		});
	}

	function getUser(token) {
		console.log(auth.token, token);
		const requestOptions = {
			method: "get",
			url: `${baseUrl}/user/me`,
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + auth?.token || token,
			},
		};

		return fetchWrapper(requestOptions).then((res) => {
			setUser(res);
			return res;
		});
	}
}
