import { Box, Typography } from "@mui/material";
import LoginForm from "../components/Login/LogInForm";

const LoginPage = () => {
	return (
		<>
			<Box sx={{ display: "flex", mb: 5, justifyContent: "center" }}>
				<Typography variant="h1">Login</Typography>
			</Box>
			<LoginForm />
		</>
	);
};

export default LoginPage;
