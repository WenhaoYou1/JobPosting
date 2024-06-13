import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL + "/jobs";
const createJob = async (token: string, body: { title: string; description: string }) => {
	const response = await axios.post(baseURL, body, {
		headers: { authorization: `Bearer ${token}` },
	});

	return response.data;
};

const getJob = async () => {
	const response = await axios.get(baseURL);

	return response.data;
};

const getUserJobs = async (token: string) => {
	const response = await axios.get(baseURL + "/mypostings", {
		headers: { authorization: `Bearer ${token}` },
	});

	return response.data;
};

const getGlobalUserJobs = async (id: string) => {
	const response = await axios.get(baseURL + `/publicuserads/`, {
		params: { id: id },
	});

	return response.data;
};

const deleteJob = async (token: string, id: string) => {
	const response = await axios.delete(baseURL + `/delete/${id}`, {
		headers: {
			authorization: `Bearer ${token}`,
		},
	});

	return response.data;
};

const markFilled = async (id: string, token: string, boolean: boolean) => {
	const response = await axios.put(
		baseURL + `/${id}/filled/${boolean}`,
		{},
		{
			headers: {
				authorization: `Bearer ${token}`,
			},
		}
	);
	return response.data;
};

const editJob = async (id: string, token: string, body: { title: string; description: string }) => {
	const response: any = axios.put(baseURL + `/${id}/edit`, body, {
		headers: {
			authorization: `Bearer ${token}`,
		},
	});

	return response.data;
};

const jobService = {
	createJob,
	getJob,
	getUserJobs,
	getGlobalUserJobs,
	deleteJob,
	markFilled,
	editJob,
};

export default jobService;
