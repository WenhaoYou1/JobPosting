import React from "react";
import { Box, Typography } from "@mui/material";

const Bottom = () => {
	return (
		<Box
			sx={{
				width: "100%",
				position: "fixed",
				bottom: 0,
				backgroundColor: "primary.main",
				textAlign: "center",
				py: 2,
			}}
		>
			<Typography variant="body2" color="primary.third">
				© {new Date().getFullYear()} Eric You. All rights reserved.
			</Typography>
		</Box>
	);
};

export default Bottom;
