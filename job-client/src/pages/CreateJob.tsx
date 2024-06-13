import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createJob, reset, editJob } from "../features/jobSlice";

interface Props {
  type: "edit" | "create";
}

const CreateJob = ({ type }: Props) => {
  // get user and job state
  const [localJob, setLocalJob] = useState<any>(null);
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const { jobs, loading, isError, isValid, message } = useAppSelector(
    (state) => state.job
  );

  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // for notifications
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isValid) {
      setText(message);
      setOpen(true);

      setTimeout(() => navigate("/"), 1000);
    }
    dispatch(reset());
  });

  useEffect(() => {
    // redirect if no user
    if (!user) {
      navigate("/login");
    }

    if (type === "edit") {
      const getGoal = async () => {
        const editGoal: any = await jobs
          .slice()
          .find((job: any) => job._id === id);
        setDesc(editGoal?.description);
        setTitle(editGoal?.title);
      };
      getGoal();
    }
  }, [navigate]);

  // forms

  interface Form {
    title: string;
    description: string;
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit: SubmitHandler<Form> = (data) => {
    if (type === "edit") {
      dispatch(editJob({ id: id as string, body: data }));
    } else {
      dispatch(createJob(data));
    }
  };
  return (
    <>
      <section style={{ padding: "5rem 0" }}>
        <Container maxWidth="md">
          <Box>
            <Box sx={{ display: "flex", mb: 5, justifyContent: "center" }}>
              <Typography variant="h1">
                {type === "edit" ? "Edit Job" : "Post Job"}
              </Typography>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <Box sx={{ mt: 5, mb: 5 }}>
                <TextField
                  defaultValue={type === "edit" ? title : ""}
                  error={Boolean(errors?.title)}
                  helperText={errors?.title ? errors.title.message : ""}
                  fullWidth
                  type="text"
                  id="title"
                  label="Title *"
                  {...register("title", {
                    required: "Please enter a job title",
                  })}
                />
              </Box>
              <Box sx={{ mt: 5, mb: 5 }}>
                <TextField
                  defaultValue={type === "edit" ? desc : ""}
                  error={Boolean(errors?.description)}
                  helperText={
                    errors?.description ? errors.description.message : ""
                  }
                  fullWidth
                  multiline
                  rows={10}
                  type="text"
                  id="description"
                  label="description *"
                  {...register("description", {
                    required: "Please enter a job description",
                  })}
                />
              </Box>

              <LoadingButton
                color="primary"
                loading={loading}
                type="submit"
                sx={{ padding: "2rem 0" }}
                variant="contained"
                fullWidth
              >
                Submit
              </LoadingButton>
            </form>
          </Box>
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
          severity="success"
          sx={{ width: "100%" }}
        >
          {text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateJob;
