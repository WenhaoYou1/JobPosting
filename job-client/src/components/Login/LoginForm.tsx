import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TextField, Box, InputAdornment, IconButton, Snackbar, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginUser, reset } from "../../features/authSlice";
import FormProvider from "../FormProvider";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Form {
	email: string;
	password: string;
}

const LoginForm = () => {
	// redux state for login
	const dispatch = useAppDispatch();
	const { loading, isValid, isError, message, user } = useAppSelector((state) => state.auth);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};
	// form validation schema
	const LoginSchema = Yup.object().shape({
		email: Yup.string()
			.email("Email must be a valid email address!")
			.required("Email is required"),
		password: Yup.string().required("Password is required"),
	});

	const defaultValues = {
		email: "",
		password: "",
	};

	const methods = useForm<Form>({
		resolver: yupResolver(LoginSchema),
		defaultValues,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = methods;

	const onSubmit: SubmitHandler<Form> = (data) => {
		const body = {
			email: data.email,
			password: data.password,
		};

		dispatch(loginUser(body));
	};

	// state for notification
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (isError) {
			setError(true);
			setOpen(true);
			setText(message);
		}

		if (isValid && user) {
			setSuccess(true);
			setTimeout(() => {
				navigate("/");
			}, 1000); // navigate after 1 seconds
		}

		dispatch(reset());
	}, [isValid, isError]);

	return (
		<>
			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				<Box sx={{ width: "50%", mx: "auto" }}>
					<Box sx={{ mt: 5, mb: 5 }}>
						<TextField
							error={Boolean(errors?.email)}
							helperText={errors?.email ? errors.email.message : null}
							fullWidth
							type="text"
							id="email"
							label="Email *"
							{...register("email", {
								required: "Email required",
								pattern: {
									value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
									message: "Please enter a valid email",
								},
							})}
						/>
					</Box>
					<Box sx={{ mt: 5, mb: 5 }}>
						<TextField
							error={Boolean(errors?.password)}
							helperText={errors?.password ? errors.password.message : null}
							fullWidth
							id="password"
							label="Password *"
							{...register("password", {
								required: "Please enter a password",
							})}
							type={showPassword ? "text" : "password"}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Box>

					<LoadingButton
						color="primary"
						loading={loading}
						type="submit"
						sx={{ padding: "2rem 0" }}
						variant="contained"
						fullWidth
					>
						Log In
					</LoadingButton>
				</Box>
			</FormProvider>

			<Snackbar
				open={success}
				autoHideDuration={3000}
				onClose={() => setSuccess(false)}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
					Log in successfully...
				</Alert>
			</Snackbar>

			<Snackbar
				open={error}
				autoHideDuration={3000}
				onClose={() => setError(false)}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert onClose={() => setError(false)} severity="error" sx={{ width: "100%" }}>
					Login failed: {text}
				</Alert>
			</Snackbar>
		</>
	);
};

export default LoginForm;
