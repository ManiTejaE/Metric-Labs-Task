import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import "./home.styles.scss";
import { useFileService, useUserService } from "../../services";
import { authAtom, userAtom } from "../../state";

const Home = () => {
	const userService = useUserService();
	const fileService = useFileService();
	const user = useRecoilValue(userAtom);
	const auth = useRecoilValue(authAtom);
	const [selectedFile, setSelectedFile] = useState([]);
	const [downloadLoading, setDownloadLoading] = useState(false);
	const [error, setError] = useState("");
	const [fileList, setFileList] = useState([]);

	useEffect(() => {
		if (auth) {
			userService.getUser().then((user) => {
				console.log(user);
			});
		}
		if (auth) {
			loadAllFiles();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth]);

	function loadAllFiles() {
		fileService.getAllByUser().then((res) => {
			console.log(res);
			setFileList(res.files);
		});
	}

	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0]);
		setError("");
		console.log("selected: ", e.target.files);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(selectedFile);
		if (selectedFile.length !== 0) {
			const formData = new FormData();

			formData.append("file", selectedFile);

			fileService
				.upload(formData)
				.then((res) => {
					loadAllFiles();
				})
				.catch((e) => {
					setError(JSON.parse(e.request.response).message);
				});
		} else {
			setError("Please select a file.");
		}
	};

	const handleLogout = () => {
		userService.logout();
	};

	const handleDownload = (id, name) => {
		setDownloadLoading(true);
		fileService
			.download(id, name)
			.then(() => {
				setDownloadLoading(false);
			})
			.catch((e) => {
				console.log(e);
				setDownloadLoading(false);
			});
	};

	return (
		<div className="home">
			<div className="input-card card">
				<div className="greet d-flex justify-content-between">
					<h4>Hello {user.first_name ? `${user.first_name}` : "User"}</h4>
					<button className="btn btn-secondary" onClick={handleLogout}>
						Logout
					</button>
				</div>
				<div className="mb-3">
					<label htmlFor="formFile" className="form-label">
						File Upload
					</label>
					<input className="form-control" type="file" name="avatar" id="formFile" onChange={handleFileChange} />
					<small className="text-danger">{error}</small>
					<div>
						<button className="btn btn-primary my-3" onClick={handleSubmit}>
							<i className="bi bi-cloud-arrow-up"></i>
							<span className="p-2">Upload</span>
						</button>
					</div>
				</div>
			</div>
			<div className="list-card card">
				<h6>List of files (Total: {fileList.length})</h6>
				<table className="table table-sm">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Filename</th>
							<th scope="col" className="text-center">
								Download
							</th>
						</tr>
					</thead>
					<tbody>
						{fileList.map((item, idx) => (
							<tr key={idx}>
								<th scope="row">{idx + 1}</th>
								<td>{item.name}</td>
								<td className="text-center">
									<button className="btn btn-primary" onClick={() => handleDownload(item._id, item.name)} disabled={downloadLoading}>
										<i className="bi bi-cloud-arrow-down"></i>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Home;
