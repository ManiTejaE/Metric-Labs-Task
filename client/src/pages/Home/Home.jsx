import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";

import "./home.styles.scss";
import { useUserService } from "../../services";
import { userAtom } from "../../state";

const Home = () => {
	const userService = useUserService();
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
			<div className="input-card card">
				<h1>Home</h1>
				<h4>
					Hello {user.first_name} {user.last_name}
				</h4>
				<div class="mb-3">
					<label for="formFile" class="form-label">
						Default file input example
					</label>
					<input class="form-control" type="file" id="formFile" />
				</div>
			</div>
			<div className="list-card card">
				<h6>List of files</h6>
			</div>
		</div>
	);
};

export default Home;
