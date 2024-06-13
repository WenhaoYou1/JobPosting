import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TextField, Box, Typography, Container, Snackbar, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginUser, reset } from "../../features/authSlice";
import FormProvider from "../FormProvider";

interface Form {
	email: string;
	password: string;
}

const LoginForm = () => {
	// redux state for login
	const dispatch = useAppDispatch();
	const { loading, isValid, isError, message, user } = useAppSelector((state) => state.auth);

	const navigate = useNavigate();

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
			<Container maxWidth="md">
				<Box>
					<Box sx={{ display: "flex", mb: 5, justifyContent: "center" }}>
						<Typography variant="h1">Login</Typography>
					</Box>
					<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
								type="password"
								id="password"
								label="Password *"
								{...register("password", {
									required: "Please enter a password",
								})}
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
							Submit
						</LoadingButton>
					</FormProvider>
				</Box>
			</Container>
		</>
	);
};

export default LoginForm;
