import React, { useState } from "react";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import {
	Typography,
	AppBar,
	Toolbar,
	Container,
	Stack,
	Button,
	ListItem,
	Box,
	Tooltip,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/authSlice";
// Icons
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import AddBoxIcon from "@mui/icons-material/AddBox";

const Header = () => {
	const { user } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [toggle, setToggle] = useState(false);

	const handleLogout = () => {
		setToggle(false);
		dispatch(logout());
	};

	const toMyPostings = () => {
		console.log(1);
		setToggle(false);
		navigate("/mypostings");
	};
	return (
		<>
			<AppBar
				sx={{
					backgroundColor: "primary.main",
					boxShadow: "0px 0px 6px 6px rgba(0,0,0,0.5)",
					color: "black",
					position: "static",
				}}
			>
				<Toolbar>
					<Container maxWidth="lg">
						<Stack
							direction="row"
							sx={{ justifyContent: "space-between", alignItems: "center" }}
						>
							<Typography component={RouterLink} to="/">
								<Typography color="primary.secondary" component="h1" variant="h2">
									Job
									<Typography color="primary.third" variant="h2" component="span">
										Posting
									</Typography>
								</Typography>
							</Typography>
							{/* Right Nav */}
							<Box className={`nav ${toggle ? "open" : ""}`}>
								{/* Home Button */}
								<Stack onClick={() => setToggle(false)}>
									<Tooltip title="Home" arrow>
										<Typography
											end
											sx={{
												"&:hover": { fontWeight: "700" },
												"&.active": { color: "primary.secondary" },
											}}
											color={"primary.third"}
											component={RouterLink}
											to="/"
										>
											<HomeIcon />
										</Typography>
									</Tooltip>
								</Stack>
								{user ? (
									<>
										{/* Create Postings */}
										<Tooltip title="Create Postings" arrow>
											<Typography
												sx={{
													"&:hover": { fontWeight: "700" },
													"&.active": { color: "primary.secondary" },
												}}
												color={"primary.third"}
												component={RouterLink}
												to="/create"
											>
												<AddBoxIcon></AddBoxIcon>
											</Typography>
										</Tooltip>
										{/* MyPosting Button */}
										<Stack onClick={toMyPostings}>
											<Tooltip title="My Postings" arrow>
												<Typography
													sx={{
														"&:hover": { fontWeight: "700" },
														"&.active": { color: "primary.secondary" },
														border: "1px solid primary",
													}}
													color={"primary.third"}
													component={RouterLink}
													to="/mypostings"
												>
													<EditCalendarIcon></EditCalendarIcon>
												</Typography>
											</Tooltip>
										</Stack>
										{/* Logout Button */}
										<Stack onClick={handleLogout}>
											<Tooltip title="Log Out" arrow>
												<Typography
													sx={{
														"&:hover": { fontWeight: "700" },
														"&.active": { color: "primary.secondary" },
													}}
													component={RouterLink}
													color={"primary.third"}
													to="/login"
												>
													<LogoutIcon></LogoutIcon>
												</Typography>
											</Tooltip>
										</Stack>
									</>
								) : (
									<>
										<Stack onClick={() => setToggle(false)}>
											<Typography
												sx={{
													"&:hover": { fontWeight: "700" },
													"&.active": { color: "primary.secondary" },
												}}
												color={"primary.third"}
												component={RouterLink}
												to="/login"
											>
												Login
											</Typography>
										</Stack>
										<Stack onClick={() => setToggle(false)}>
											<Typography
												sx={{
													"&:hover": { fontWeight: "700" },
													"&.active": { color: "primary.secondary" },
												}}
												color={"primary.third"}
												component={RouterLink}
												to="/signup"
											>
												Signup
											</Typography>
										</Stack>
									</>
								)}
							</Box>
						</Stack>
					</Container>
				</Toolbar>
			</AppBar>
			{/* Purple Bar */}
			<Box
				sx={{
					height: 16,
					background: "linear-gradient(to right, #FFF3CB 0%, #FEDC6D 50%, #FFC300 100%)",
				}}
			/>
		</>
	);
};

export default Header;
