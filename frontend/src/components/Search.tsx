import React, { useRef, useState } from "react";
import {
  Box,
  FormControl,
  OutlinedInput,
  IconButton,
  SxProps,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export interface SearchProps {
  onChange?: (value: string | null) => void;
  placeholder?: string;
  size?: "small" | "medium";
  sx?: SxProps;
  id?: string;
  iconAriaLabel?: string;
  disableWhenEmpty?: boolean;
  clearOnSubmit?: boolean;
}

export default function Search({
  onChange,
  placeholder = "Search…",
  size = "small",
  sx,
  id = "search",
  iconAriaLabel = "perform search",
  disableWhenEmpty = false,
  clearOnSubmit = false,
}: SearchProps) {
  const [internal, setInternal] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setInternal(newValue);

    // Auto-fire onChange when cleared
    if (newValue.trim() === "") {
      onChange?.(null);
    }
  };

  const triggerChange = () => {
    const normalized = internal.trim() === "" ? null : internal;
    onChange?.(normalized);
    if (clearOnSubmit) setInternal("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      triggerChange();
    }
  };

  const isEmpty = internal.trim() === "";

  return (

    <FormControl sx={{ width: { xs: "100%", md: "25ch" }, ...(sx && typeof sx === 'object' ? sx : {}) }}
      variant="outlined"
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <OutlinedInput
          inputRef={inputRef}
          size={size}
          id={id}
          placeholder={placeholder}
          sx={(theme) => ({
            // Adjust background and text colors for dark mode
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.background.paper,
            color: theme.palette.text.primary,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[700]
                  : theme.palette.grey[400],
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[500]
                  : theme.palette.grey[600],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "& input::placeholder": {
              color: theme.palette.text.secondary,
              opacity: 1, // Ensures it's not overly faint
            },
          })}
          inputProps={{ "aria-label": "search" }}
          value={internal}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />

        <IconButton
          size={size === "small" ? "small" : "medium"}
          onClick={triggerChange}
          aria-label={iconAriaLabel}
          sx={{ ml: 1 }}
          disabled={disableWhenEmpty && isEmpty}
        >
          <SearchRoundedIcon />
        </IconButton>
      </Box>
    </FormControl>
  );
}
