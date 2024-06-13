import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
}

const Search = ({ setSearchTerm, searchTerm }: Props) => {
  return (
    <TextField
      value={searchTerm}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchTerm(e.target.value)
      }
      sx={{ maxWidth: "30rem" }}
      id="input-with-icon-textfield"
      label="Search Job"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      variant="outlined"
    />
  );
};

export default Search;
