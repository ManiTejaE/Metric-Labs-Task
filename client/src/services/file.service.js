import { useFetchWrapper } from "../helpers";


export { useFileService };

function useFileService() {
	const baseUrl = process.env.REACT_APP_SERVER_URL;
	const fetchWrapper = useFetchWrapper();

	return {
		upload,
		getAllByUser,
	};

	function upload(file) {
		const requestOptions = {
			method: "post",
			url: `${baseUrl}/file/upload`,
			headers: {
				Accept: "application/json",
				"Content-Type": "multipart/form-data",
			},
			data: file,
		};

		return fetchWrapper(requestOptions);
	}

	function getAllByUser() {
		const requestOptions = {
			method: "get",
			url: `${baseUrl}/file/user/all`,
			headers: {
				"Content-Type": "application/json",
			},
		};

		return fetchWrapper(requestOptions);
	}
}
