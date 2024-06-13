import { Box, Typography, Link as MuiLink } from "@mui/material";
import SignupForm from "../components/Signup/SignupForm";
import { Link } from "react-router-dom";

const SignupPage = () => {
	return (
		<>
			<Box sx={{ display: "flex", mb: 5, justifyContent: "center" }}>
				<Typography variant="h1">Sign Up</Typography>
			</Box>
			<SignupForm />
			<Box sx={{ display: "flex", mt: 3, justifyContent: "center" }}>
				<Typography variant="body1">
					Already have an account?{" "}
					<MuiLink
						component={Link}
						to="/login"
						sx={{
							color: "primary.secondary",
							textDecoration: "underline",
							"&:hover": {
								color: "primary.main",
								textDecoration: "underline",
							},
						}}
					>
						Log in
					</MuiLink>
				</Typography>
			</Box>
		</>
	);
};

export default SignupPage;
