import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Stack, Button, Link } from "@mui/material";
import { parseISO, formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { deleteJob, updateFilled } from "../features/jobSlice";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import authService from "../app/api/authService";
const JobCard = ({ job }: any) => {
  const [id, setID] = useState("");

  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const date = formatDistanceToNow(parseISO(job.createdAt));

  // get user ID if user exists
  useEffect(() => {
    if (user) {
      const inStorage = localStorage.getItem("user");

      if (inStorage) {
        const { token } = JSON.parse(inStorage);
        const getIds = async () => {
          const response = await authService.getUserID(token);
          setID(response.userID._id);
        };
        getIds();
      }
    }
  }, []);
  return (
    <Paper sx={{ display: "flex", flexDirection: "column" }} elevation={3}>
      <Box sx={{ padding: "2rem", mb: 2 }}>
        <Typography sx={{ fontWeight: "700" }} variant="h3" component="h3">
          {job.title}
        </Typography>
        <Stack
          sx={{
            mb: 2,
            mt: 2,
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "flex-start" },
            flexDirection: { xs: "row", sm: "column" },
          }}
        >
          <Typography sx={{ opacity: 0.8 }} variant="body1" component="p">
            Posted {`${date} ago`}
          </Typography>
          <Typography variant="body1" component="p">
            By{" "}
            <Link
              onClick={() => navigate(`/userads/${job.user._id}`)}
              sx={{
                "&:hover": { fontWeight: 700 },
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              {job.user.username}
            </Link>
          </Typography>
        </Stack>
        <Typography sx={{ opacity: 0.7 }} variant="body1" component="p">
          {job.description.substring(0, 200) + "..."}
        </Typography>
      </Box>
      <Button
        onClick={() => navigate(`/details/${job._id}`)}
        sx={{ padding: "2rem", opacity: 0.8, mt: "auto" }}
        fullWidth
        variant="contained"
      >
        View More
      </Button>
      {job.user._id === id ? (
        <Box sx={{ backgroundColor: "black", padding: "2rem" }}>
          <Stack spacing={3} direction="row">
            <Button
              onClick={() => navigate(`/edit/${job._id}`)}
              color="primary"
              variant="contained"
            >
              Edit
            </Button>
            <Button
              onClick={() =>
                dispatch(updateFilled({ id: job._id, boolean: !job.filled }))
              }
              variant="outlined"
              color="primary"
            >
              Mark {job.filled ? "Unfilled" : "Filled"}
            </Button>
            <Button
              onClick={() => dispatch(deleteJob(job._id))}
              color="error"
              variant="outlined"
            >
              Delete
            </Button>
          </Stack>
        </Box>
      ) : (
        ""
      )}
    </Paper>
  );
};

export default JobCard;
