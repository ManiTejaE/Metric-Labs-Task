import { useFetchWrapper } from "../helpers";
import { saveAs } from "file-saver";

export { useFileService };

function useFileService() {
	const baseUrl = process.env.REACT_APP_SERVER_URL;
	const fetchWrapper = useFetchWrapper();

	return {
		upload,
		getAllByUser,
		download,
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

	function saveAsPDF(binaryData, name) {
		const file = new Blob([binaryData], { type: "application/pdf" });
		saveAs(file, name);
	}

	function download(id, name) {
		const requestOptions = {
			method: "get",
			url: `${baseUrl}/file/download/${id}`,
			headers: {
				"Content-Type": "application/json",
			},
			responseType: "blob",
		};

		return fetchWrapper(requestOptions).then((res) => {
			saveAsPDF(res, name);
		});
	}
}
