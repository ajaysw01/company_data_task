import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import { fetchCompanyData } from "../features/companySlice";
import { logout } from "../features/authSlice";

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { companies, countryStats, loading, error } = useSelector(
    (state) => state.company
  );
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchCompanyData()).unwrap();
        if (result.status !== "success") {
          setDataError("Failed to fetch data properly");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.status === 401) {
          toast.error("Session expired. Please login again");
          navigate("/login");
        } else {
          toast.error(error.message || "Failed to fetch data");
        }
      }
    };
    fetchData();
  }, [dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || dataError) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error">{error || dataError}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" elevation={2}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
            Company Dashboard
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{
              backgroundColor: "white",
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.grey[100],
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ width: "100%" }}
          >
            {/* Country Statistics */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                flex: 1,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                width: { xs: "100%", md: "50%" },
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Country Statistics
              </Typography>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Country Code
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Total
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Active
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Inactive
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {countryStats.map((row, index) => (
                      <TableRow
                        key={row.country_code || index}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{row.country_code}</TableCell>
                        <TableCell align="right">
                          {row["Total Companies"]}
                        </TableCell>
                        <TableCell align="right">
                          {row["Active Companies"]}
                        </TableCell>
                        <TableCell align="right">
                          {row["Inactive Companies"]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Chart */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                flex: 1,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                width: { xs: "100%", md: "50%" },
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Company Statistics Chart
              </Typography>
              <Box sx={{ height: 400, width: "100%" }}>
                <ResponsiveContainer>
                  <BarChart data={countryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country_code" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.toLocaleString()}
                      domain={[0, "auto"]}
                      ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000]}
                    />
                    <Tooltip
                      formatter={(value) => value.toLocaleString()}
                      labelStyle={{ fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                      dataKey="Total Companies"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Active Companies"
                      fill={theme.palette.success.main}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Inactive Companies"
                      fill={theme.palette.error.main}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Stack>

          {/* Companies Table */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Companies Data
            </Typography>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Safe Number</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Matched Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Credit Score</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Credit Limit</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Turnover Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Country</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Sector</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((company, index) => (
                      <TableRow
                        key={company.safeNumber || index}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{company.safeNumber}</TableCell>
                        <TableCell>{company.matched_name}</TableCell>
                        <TableCell>{company.credit_score_type}</TableCell>
                        <TableCell>{company.credit_limit_type}</TableCell>
                        <TableCell>{company.turnover_type}</TableCell>
                        <TableCell>{company.status}</TableCell>
                        <TableCell>{company.country_code}</TableCell>
                        <TableCell>{company.sector}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={companies.length}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default Dashboard;
