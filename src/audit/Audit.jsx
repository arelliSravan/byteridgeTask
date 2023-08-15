import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { userActions } from "_store";
import {
  Container,
  InputAdornment,
  TextField,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";

export { Audit };

function Audit() {
  const users = useSelector((x) => x.users.list);
  const dispatch = useDispatch();

  const [rows, setRows] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fieldName, setFieldName] = useState("");

  const [timeFormat, setTimeFormat] = useState("12h");

  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      sortable: true,
      width: 200,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      sortable: true,
      width: 200,
    },
    {
      field: "username",
      headerName: "UserName",
      sortable: true,
      width: 200,
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      sortable: true,
      width: 200,
      valueFormatter: (params) =>
        timeFormat == "12h"
          ? moment(params.value).format("DD/MM/YYYY hh:mm A")
          : moment(params.value).format("DD/MM/YYYY HH:mm"),
    },
  ];

  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);

  useEffect(() => {
    if (users && users.value) setRows(users.value);
  }, [users]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value !== "") {
      applyFilter(event.target.value);
    } else {
      setRows(users.value);
    }
  };

  const handleSelectChange = (event) => {
    setFieldName(event.target.value);
  };

  const handleTimeFormatChange = (event) => {
    setTimeFormat(event.target.value);
  };

  const applyFilter = (value) => {
    if (fieldName !== "") {
      const filteredRows = users.value.filter((row) => {
        return row[fieldName].toLowerCase().includes(value.toLowerCase());
      });
      setRows(filteredRows);
    } else {
      const filteredRows = users.value.filter((row) => {
        return JSON.stringify(row).toLowerCase().includes(value.toLowerCase());
      });
      setRows(filteredRows);
    }
  };

  const handleCloseIcon = () => {
    setFieldName("");
    setSearchTerm("");
    setRows(users.value);
  };

  return (
    <div>
      <h1>Auditor Page</h1>
      <Container sx={{ mt: 5, mb: 5 }}>
        <FormControl sx={{ width: "200px", mr: 2 }}>
          <TextField
            label="Time Format"
            select
            value={timeFormat}
            onChange={handleTimeFormatChange}
            SelectProps={{ IconComponent: () => null }}
          >
            <MenuItem value={"12h"}>12 H</MenuItem>
            <MenuItem value={"24h"}>24 H</MenuItem>
          </TextField>
        </FormControl>
        <FormControl sx={{ width: "200px", mr: 2 }}>
          <TextField
            label="Filter Name"
            select
            value={fieldName}
            onChange={handleSelectChange}
            SelectProps={{ IconComponent: () => null }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {fieldName != "" && (
                    <CloseIcon
                      onClick={handleCloseIcon}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value={"firstName"}>First Name</MenuItem>
            <MenuItem value={"lastName"}>Last Name</MenuItem>
            <MenuItem value={"username"}>UserName</MenuItem>
          </TextField>
        </FormControl>
        <TextField
          id="search"
          type="search"
          label="Search"
          value={searchTerm}
          onChange={handleChange}
          sx={{ width: 600 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Container>
      {rows && rows.length > 0 && (
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          disableColumnMenu={true}
          hideFooterSelectedRowCount={true}
          pageSizeOptions={[5, 10, 20, 50, 100]}
        />
      )}
    </div>
  );
}
