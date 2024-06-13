import React, { useState } from "react";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { Typography, AppBar, Toolbar, Container, Stack, Button, ListItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/authSlice";
import { Home } from "@mui/icons-material";
// Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
						<ul className={`nav ${toggle ? "open" : ""}`}>
							<li onClick={() => setToggle(false)}>
								{/* Home Button */}
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
							</li>
							{user ? (
								<>
									<ListItem
										sx={{
											display: { xs: "none", md: "block" },
											width: "auto",
											padding: "0rem",
										}}
									>
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
									</ListItem>
									<Stack onClick={toMyPostings}>
										{/* Edit Button */}
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
									</Stack>
									<Stack onClick={handleLogout}>
										{/* Logout Button */}
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
											to="/register"
										>
											Register
										</Typography>
									</Stack>
								</>
							)}
						</ul>
					</Stack>
				</Container>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
