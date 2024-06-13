import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";

interface Props {
  setOrder: React.Dispatch<React.SetStateAction<string>>;
  order: string;
}

const Sort = ({ setOrder, order }: Props) => {
  return (
    <Stack sx={{ alignItems: "center" }} direction="row">
      <Typography sx={{ mr: 2 }} variant="h3" component="p">
        Sort By
      </Typography>
      <select
        value={order}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setOrder(e.target.value)
        }
        style={{ padding: "1rem" }}
        name="order"
        id="order"
      >
        <option value="asc">Recent Jobs</option>
        <option value="desc">Older Jobs</option>
      </select>
    </Stack>
  );
};

export default Sort;
