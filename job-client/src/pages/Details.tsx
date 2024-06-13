import React, { useState, useEffect } from "react";
import {
  Typography,
  Stack,
  Grid,
  Box,
  Container,
  Button,
  Link,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { parseISO, formatDistanceToNow } from "date-fns";
import axios from "axios";

const Details = () => {
  const [jobs, setJobs] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    setLoading(true);
    const getItems = async () => {
      const response = await axios.get(`/api/jobs/details/${id}`);
      setJobs(response.data.jobs);
      setLoading(false);
    };

    getItems();
  }, []);
  console.log(jobs);

  const renderUI = () => {
    if (loading) {
      return (
        <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      );
    } else if (!jobs) {
      return (
        <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
          <Typography variant="h3" component="p" sx={{ opacity: 0.7 }}>
            Sorry, No Job Found
          </Typography>
        </Box>
      );
    } else {
      const date = formatDistanceToNow(parseISO(jobs.createdAt));

      return (
        <>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 2 }} variant="h1" component="h2">
                {jobs?.title}
              </Typography>
              <Stack
                sx={{
                  mb: 2,
                  mt: 2,
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Typography sx={{ opacity: 0.8 }} variant="body1" component="p">
                  Posted {`${date} ago`}
                </Typography>
                <Typography variant="body1" component="p">
                  By{" "}
                  <Link
                    onClick={() => navigate(`/userads/${jobs.user._id}`)}
                    sx={{
                      "&:hover": { fontWeight: 700 },
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    {jobs.user.username}
                  </Link>
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                sx={{ mb: 2, padding: "1rem 0" }}
                variant="contained"
                fullWidth
              >
                Apply
              </Button>
              <Button sx={{ padding: "1rem 0" }} variant="outlined" fullWidth>
                Contact
              </Button>
            </Grid>
          </Grid>
          <Typography
            sx={{ opacity: 0.7, mb: 1, mt: 2 }}
            variant="h3"
            component="h3"
          >
            Overview
          </Typography>
          <Typography
            sx={{ opacity: 0.7, maxWidth: "50rem", whiteSpace: "pre-wrap" }}
            variant="body1"
            component="p"
          >
            {jobs.description}
          </Typography>
        </>
      );
    }
  };
  return (
    <section style={{ padding: "6rem 0" }}>
      <Container maxWidth="lg">{renderUI()}</Container>
    </section>
  );
};

export default Details;
