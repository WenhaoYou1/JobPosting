import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
import { loginUser, reset } from "../features/authSlice";

interface Form {
  email: string;
  password: string;
}

const Login = () => {
  // redux state for register
  const dispatch = useAppDispatch();
  const { loading, isValid, isError, message, user } = useAppSelector(
    (state) => state.auth
  );

  // react hook form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Form>();

  const watchPassword = watch("password");

  const onSubmit: SubmitHandler<Form> = (data) => {
    const body = {
      email: data.email,
      password: data.password,
    };

    dispatch(loginUser(body));
  };

  // state for notification and redirecting
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      setOpen(true);
      setText(message);
    }

    if (isValid && user) {
      navigate("/");
    }

    dispatch(reset());
  }, [isValid, isError]);

  return (
    <>
      <section style={{ padding: "5rem 0" }}>
        <Container maxWidth="md">
          <Box>
            <Box sx={{ display: "flex", mb: 5, justifyContent: "center" }}>
              <Typography variant="h1">Login</Typography>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <Box sx={{ mt: 5, mb: 5 }}>
                <TextField
                  error={Boolean(errors?.email)}
                  helperText={errors?.email ? errors.email.message : null}
                  fullWidth
                  type="text"
                  id="email"
                  label="Email *"
                  {...register("email", {
                    required: "Email required",
                    pattern: {
                      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                      message: "Please enter a valid email",
                    },
                  })}
                />
              </Box>
              <Box sx={{ mt: 5, mb: 5 }}>
                <TextField
                  error={Boolean(errors?.password)}
                  helperText={errors?.password ? errors.password.message : null}
                  fullWidth
                  type="password"
                  id="password"
                  label="Password *"
                  {...register("password", {
                    required: "Please enter a password",
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
          severity="error"
          sx={{ width: "100%" }}
        >
          {text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
