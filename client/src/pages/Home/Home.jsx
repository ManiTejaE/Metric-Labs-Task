import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useUserService } from "../../services";
import { userAtom } from "../../state";

const Home = () => {
	const userService = useUserService();
	// const [user, setUser] = useState({});
	const user = useRecoilValue(userAtom);

	useEffect(() => {
		if (!user) {
			userService.getUser().then((user) => {
				console.log(user);
			});
		}
	}, [user]);
	return (
		<div className="home">
			<h1>Home</h1>
			<pre>{JSON.stringify(user)}</pre>
		</div>
	);
};

export default Home;
