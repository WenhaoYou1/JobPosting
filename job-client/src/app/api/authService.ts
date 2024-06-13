import axios from "axios";

// const baseURL = "/api/users";
const baseURL = process.env.REACT_APP_API_URL + "/users";
const registerUser = async (body: { username: string; email: string; password: string }) => {
	const response: any = await axios.post(baseURL + "/signup", body);

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}
	return response.data;
};

const loginUser = async (body: { email: string; password: string }) => {
	const response = await axios.post(baseURL + "/login", body);

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}
	return response.data;
};

const logout = () => {
	localStorage.removeItem("user");
};

// get user id

const getUserID = async (token: string) => {
	const response = await axios.get(baseURL + "/getID", {
		headers: { authorization: `Bearer ${token}` },
	});

	return response.data;
};

const authService = {
	registerUser,
	loginUser,
	logout,
	getUserID,
};

export default authService;
