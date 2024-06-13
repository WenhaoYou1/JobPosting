import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import jobService from "../app/api/jobService";

interface Init {
  jobs: [];
  loading: boolean;
  isError: boolean;
  isValid: boolean;
  message: string;
}

const initialState = {
  jobs: [],
  loading: false,
  isError: false,
  isValid: false,
  message: "",
};

// create job
export const createJob = createAsyncThunk(
  "jobs/create",
  async (body: { title: string; description: string }, thunkAPI) => {
    const inStorage = localStorage.getItem("user");

    if (inStorage) {
      const { token } = JSON.parse(inStorage);

      try {
        const response = await jobService.createJob(token, body);
        return response;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response.data.message || error.message
        );
      }
    }
  }
);

// get private user jobs
export const getUserJob = createAsyncThunk(
  "jobs/get/user",
  async (_, thunkAPI) => {
    const inStorage = localStorage.getItem("user");
    if (inStorage) {
      const { token } = JSON.parse(inStorage);
      try {
        return await jobService.getUserJobs(token);
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response.data.message || error.message
        );
      }
    }
  }
);

// get jobs

export const getJobs = createAsyncThunk("jobs/get", async () => {
  return await jobService.getJob();
});

// get public user jobs

export const getPublicUserJob = createAsyncThunk(
  "jobs/get/publicUser",
  async (id: string, thunkAPI) => {
    try {
      return await jobService.getGlobalUserJobs(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

// delete user job

export const deleteJob = createAsyncThunk(
  "jobs/delete",
  async (id: string, thunkAPI) => {
    try {
      const inStorage = localStorage.getItem("user");
      if (inStorage) {
        const { token } = JSON.parse(inStorage);
        return await jobService.deleteJob(token, id);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

export const updateFilled = createAsyncThunk(
  "jobs/fill",
  async (data: { id: string; boolean: boolean }, thunkAPI) => {
    const { id, boolean } = data;
    const inStorage = localStorage.getItem("user");

    if (inStorage) {
      const { token } = JSON.parse(inStorage);
      try {
        return await jobService.markFilled(id, token, boolean);
      } catch (error: any) {
        console.log(error);
        return thunkAPI.rejectWithValue(
          error.response.data.message || error.message
        );
      }
    }
  }
);

export const editJob = createAsyncThunk(
  "jobs/edit",
  async (
    data: { id: string; body: { title: string; description: string } },
    thunkAPI
  ) => {
    const { id, body } = data;
    const inStorage = localStorage.getItem("user");

    if (inStorage) {
      const { token } = JSON.parse(inStorage);
      try {
        return await jobService.editJob(id, token, body);
      } catch (error: any) {
        console.log(error);
        return thunkAPI.rejectWithValue(
          error.response.data.message || error.message
        );
      }
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.isError = false;
      state.isValid = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createJob.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.isValid = true;
        state.message = "Succesfully Added Job!";
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isError = true;
        state.loading = false;
        state.message = action.payload as string;
      })
      .addCase(editJob.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(editJob.fulfilled, (state, action) => {
        state.loading = false;
        state.isValid = true;
        state.message = "Succesfully Edited Job!";
      })
      .addCase(editJob.rejected, (state, action) => {
        state.isError = true;
        state.loading = false;
        state.message = action.payload as string;
      })
      .addCase(getJobs.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        // state.isValid = true;
        state.jobs = action.payload.jobs;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.isError = true;
        state.loading = false;
        state.message = action.payload as string;
      })
      .addCase(getUserJob.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserJob.fulfilled, (state, action) => {
        state.loading = false;
        // state.isValid = true;
        state.jobs = action.payload.jobs;
      })
      .addCase(getUserJob.rejected, (state, action) => {
        state.isError = true;
        state.loading = false;
        state.message = action.payload as string;
      })
      .addCase(getPublicUserJob.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPublicUserJob.fulfilled, (state, action) => {
        state.loading = false;
        // state.isValid = true;
        state.jobs = action.payload.jobs;
      })
      .addCase(getPublicUserJob.rejected, (state, action) => {
        state.isError = true;
        state.loading = false;
        state.message = action.payload as string;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isValid = true;
        state.message = "Succesfully Deleted Job";
        state.jobs = state.jobs.filter(
          (job: any) => job._id !== action.payload.id
        );
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateFilled.fulfilled, (state, action) => {
        state.isValid = true;
        state.message = `Succesfully ${
          action.payload.updatedJob.filled ? "Filled" : "Unfilled"
        } Job`;
        state.jobs = state.jobs.map((job: any) => {
          if (job._id === action.payload.updatedJob._id) {
            return action.payload.updatedJob;
          }
          return job;
        }) as never[];
        console.log(action.payload);
      })
      .addCase(updateFilled.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = jobSlice.actions;

export default jobSlice.reducer;
