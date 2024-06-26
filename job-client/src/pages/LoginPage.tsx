import { Box, Typography, Link as MuiLink } from "@mui/material";
import LoginForm from "../components/Login/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
	return (
		<>
			<Box sx={{ display: "flex", mb: 5, justifyContent: "center" }}>
				<Typography variant="h1">Login</Typography>
			</Box>
			<LoginForm />
			<Box sx={{ display: "flex", mt: 3, justifyContent: "center" }}>
				<Typography variant="body1">
					Don't have an account?{" "}
					<MuiLink
						component={Link}
						to="/signup"
						sx={{
							color: "primary.secondary",
							textDecoration: "underline",
							"&:hover": {
								color: "primary.main",
								textDecoration: "underline",
							},
						}}
					>
						Sign up
					</MuiLink>
				</Typography>
			</Box>
		</>
	);
};

export default LoginPage;
