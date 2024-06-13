import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { inspect } from "util";
import authService from "../app/api/authService";
interface Init {
	user: null | { name: string };
	loading: boolean;
	isError: boolean;
	isValid: boolean;
	message: string;
}

const inStorage = localStorage.getItem("user");

const reloadUser = inStorage ? { name: JSON.parse(inStorage).name } : null;

const initialState: Init = {
	user: reloadUser,
	loading: false,
	isError: false,
	isValid: false,
	message: "",
};

export const registerUser = createAsyncThunk(
	"auth/signup",
	async (
		body: {
			username: string;
			email: string;
			password: string;
		},
		thunkAPI
	) => {
		try {
			return await authService.registerUser(body);
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.response.data.message || error.message);
		}
	}
);

export const loginUser = createAsyncThunk(
	"auth/login",
	async (
		body: {
			email: string;
			password: string;
		},
		thunkAPI
	) => {
		try {
			return await authService.loginUser(body);
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.response.data.message || error.message);
		}
	}
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
	return await authService.logout();
});

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		reset: (state) => {
			state.loading = false;
			state.isError = false;
			state.isValid = false;
			state.message = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isValid = true;
				state.user = { name: action.payload.name };
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.isError = true;
				state.message = action.payload as string;
			})
			.addCase(loginUser.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isValid = true;
				state.user = { name: action.payload.name };
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.isError = true;
				state.message = action.payload as string;
			})
			.addCase(logout.fulfilled, (state, action) => {
				state.user = null;
			});
	},
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
