import React, { useState, useEffect } from "react";
import {
	Container,
	Stack,
	Typography,
	CircularProgress,
	Snackbar,
	Alert,
	Box,
	Grid,
	Pagination,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getJobs, reset, getUserJob, getPublicUserJob } from "../features/jobSlice";
import { useNavigate, useParams } from "react-router-dom";
import Sort from "../components/Sort";
import Search from "../components/Search";
import JobCard from "../components/JobCard";

interface Props {
	title: string;
	type: "all" | "mypostings" | "userads";
}
const DisplayJobs = ({ title, type }: Props) => {
	// params
	const { id } = useParams();

	// job global state and local state
	const { jobs, loading, isValid, isError, message } = useAppSelector((state) => state.job);
	const { user } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	useEffect(() => {
		if (type === "mypostings" && !user) {
			navigate("/login");
		}
		if (type === "mypostings") {
			dispatch(getUserJob());
		} else if (type === "userads") {
			dispatch(getPublicUserJob(id as string));
		} else {
			dispatch(getJobs());
		}
	}, [navigate, dispatch]);

	// displaying messages
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("hello world");

	useEffect(() => {
		if (isValid) {
			setOpen(true);
			setText(message);
		}
		dispatch(reset());
	}, [isValid, isError]);

	// state to get filter values
	const [order, setOrder] = useState("asc");
	const [searchTerm, setSearchTerm] = useState("");
	// pagination logic
	const [currentPage, setCurrentPage] = useState(1);
	const jobsPerPage = 6;
	let totalPages = Math.ceil(jobs.length / jobsPerPage);
	const lastIndex = currentPage * jobsPerPage;
	const firstIndex = lastIndex - jobsPerPage;

	// render UI

	const renderResults = () => {
		if (loading) {
			return (
				<Box
					sx={{
						mt: 5,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<CircularProgress color="primary" />
				</Box>
			);
		} else if (jobs.length < 1) {
			return (
				<Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
					<Typography variant="h3" sx={{ opacity: 0.8 }}>
						Sorry, No Jobs Avaliable
					</Typography>
				</Box>
			);
		} else {
			return (
				<Box>
					<Grid container spacing={3}>
						{renderOptions()}
					</Grid>
				</Box>
			);
		}
	};

	const renderOptions = () => {
		let renderedJobs;

		if (order === "asc") {
			if (searchTerm) {
				const regex = new RegExp(searchTerm, "gi");
				renderedJobs = jobs
					.slice()
					.reverse()

					.filter((job: any) => job.title.match(regex) || job.description.match(regex));

				totalPages = Math.ceil(renderedJobs.length / jobsPerPage);

				renderedJobs = renderedJobs
					.slice(firstIndex, lastIndex)
					.map((item: any, i: number) => (
						<Grid key={i} sx={{ display: "flex" }} item xs={12} sm={6} md={4}>
							<JobCard job={item} />
						</Grid>
					));
			} else {
				renderedJobs = jobs
					.slice()
					.reverse()
					.slice(firstIndex, lastIndex)
					.map((item: any, i: number) => (
						<Grid key={i} sx={{ display: "flex" }} item xs={12} sm={6} md={4}>
							<JobCard job={item} />
						</Grid>
					));
			}
		} else {
			if (searchTerm) {
				const regex = new RegExp(searchTerm, "gi");
				renderedJobs = jobs.filter(
					(job: any) => job.title.match(regex) || job.description.match(regex)
				);

				totalPages = Math.ceil(renderedJobs.length / jobsPerPage);

				renderedJobs = renderedJobs
					.slice(firstIndex, lastIndex)
					.map((item: any, i: number) => (
						<Grid key={i} sx={{ display: "flex" }} item xs={12} sm={6} md={4}>
							<JobCard job={item} />
						</Grid>
					));
			} else {
				renderedJobs = jobs.slice(firstIndex, lastIndex).map((item: any, i: number) => (
					<Grid key={i} sx={{ display: "flex" }} item xs={12} sm={6} md={4}>
						<JobCard job={item} />
					</Grid>
				));
			}
		}

		return renderedJobs;
	};

	return (
		<>
			<section style={{ padding: "6rem 0" }}>
				<Container maxWidth="lg">
					<Stack
						sx={{
							gap: { xs: "2rem", md: "0" },
							flexDirection: { xs: "column", md: "row" },
							justifyContent: "space-between",
							alignItems: { xs: "flex-start", md: "center" },
						}}
					>
						<Typography variant="h1" component="h2">
							{title}
						</Typography>
						<Stack sx={{ gap: "3rem", flexDirection: { xs: "column", md: "row" } }}>
							<Sort order={order} setOrder={setOrder} />
							<Search setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
						</Stack>
					</Stack>
				</Container>
				<Container sx={{ mt: 5 }} maxWidth="lg">
					{renderResults()}
					{jobs.length > 0 && (
						<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
							<Pagination
								onChange={(event: React.ChangeEvent<unknown>, value: number) =>
									setCurrentPage(value)
								}
								count={totalPages}
								color="primary"
							/>
						</Box>
					)}
				</Container>
			</section>
			<Snackbar
				sx={{
					"&.MuiSnackbar-anchorOriginTopRight": {
						top: "10rem",
					},
				}}
				anchorOrigin={{ horizontal: "right", vertical: "top" }}
				open={open}
				autoHideDuration={3000}
				onClose={() => setOpen(false)}
			>
				<Alert
					onClose={() => setOpen(false)}
					severity={isError === true ? "error" : "success"}
					sx={{ width: "100%" }}
				>
					{text}
				</Alert>
			</Snackbar>
		</>
	);
};

export default DisplayJobs;
