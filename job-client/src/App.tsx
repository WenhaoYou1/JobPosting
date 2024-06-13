import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DisplayJobs from "./pages/DisplayJobs";
import CreateJob from "./pages/CreateJob";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Bottom from "./components/Bottom";
function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route
					path="/"
					element={
						<DisplayJobs
							key={window.location.pathname}
							type="all"
							title={"Job Posted"}
						/>
					}
				/>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route
					path="/mypostings"
					element={
						<DisplayJobs
							key={window.location.pathname}
							type="mypostings"
							title={"My Postings"}
						/>
					}
				/>
				<Route
					path="/userads/:id"
					element={
						<DisplayJobs
							key={window.location.pathname}
							type="userads"
							title={"User Ad"}
						/>
					}
				/>
				<Route path="/create" element={<CreateJob type="create" />} />
				<Route path="/edit/:id" element={<CreateJob type="edit" />} />
				<Route path="/details/:id" element={<Details />} />
			</Routes>
			<Bottom />
		</Router>
	);
}

export default App;
