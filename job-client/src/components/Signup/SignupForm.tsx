import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
	TextField,
	Box,
	Typography,
	Container,
	Snackbar,
	Alert,
	InputAdornment,
	IconButton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { registerUser, reset } from "../../features/authSlice";
import FormProvider from "../FormProvider";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Form {
	username: string;
	email: string;
	password: string;
	password2: string;
}

const SignupForm = () => {
	// redux state for register
	const dispatch = useAppDispatch();
	const { loading, isValid, isError, message, user } = useAppSelector((state) => state.auth);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};
	// form validation schema
	const SignupSchema = Yup.object().shape({
		username: Yup.string()
			.required("Username required")
			.max(30, "Username must be under 30 characters"),
		email: Yup.string()
			.email("Email must be a valid email address!")
			.required("Email is required"),
		password: Yup.string().required("Please enter a password"),
		password2: Yup.string()
			.oneOf([Yup.ref("password")], "Passwords do not match")
			.required("Please confirm password"),
	});

	const defaultValues = {
		username: "",
		email: "",
		password: "",
		password2: "",
	};

	const methods = useForm<Form>({
		resolver: yupResolver(SignupSchema),
		defaultValues,
	});

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = methods;

	const onSubmit: SubmitHandler<Form> = (data) => {
		const body = {
			username: data.username,
			email: data.email,
			password: data.password,
		};

		dispatch(registerUser(body));
	};

	// state for notification
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");

	useEffect(() => {
		if (isError) {
			setOpen(true);
			setText(message);
		}

		if (isValid && user) {
			navigate("/");
		}

		dispatch(reset());
	}, [isValid, isError]);

	return (
		<>
			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				<Box sx={{ width: "50%", mx: "auto" }}>
					<Box sx={{ mt: 5, mb: 5 }}>
						<TextField
							error={Boolean(errors?.username)}
							helperText={errors?.username ? errors.username.message : null}
							fullWidth
							type="text"
							id="username"
							label="Username *"
							{...register("username", {
								required: "Username required",
								maxLength: {
									value: 30,
									message: "Username must be under 30 characters",
								},
							})}
						/>
					</Box>
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
					<Box sx={{ mt: 5, mb: 5 }}>
						<TextField
							error={Boolean(errors?.password2)}
							helperText={errors?.password2 ? errors.password2.message : null}
							{...register("password2", {
								required: "Please confirm password",
								validate: (v) => v === watch("password") || "Password do not match",
							})}
							fullWidth
							id="password2"
							label="Confirm Password"
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
						Sign Up
					</LoadingButton>
				</Box>
			</FormProvider>
		</>
	);
};

export default SignupForm;
