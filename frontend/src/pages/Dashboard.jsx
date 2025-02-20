import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  TablePagination,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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
import { logout } from "../features/authSlice"; // Import logout action

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  overflowX: "auto",
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companies, countryStats, loading, error } = useSelector(
    (state) => state.company
  );
  const [dataError, setDataError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default to 10 records per page

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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Top Navbar with Logout Button */}
      <AppBar position="static" color="default">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Dashboard</Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Company Stats Table & Chart Side by Side */}
        {countryStats && countryStats.length > 0 && (
          <>
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Country Statistics
                </Typography>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Country Code</b>
                        </TableCell>
                        <TableCell align="right">
                          <b>Total Companies</b>
                        </TableCell>
                        <TableCell align="right">
                          <b>Active Companies</b>
                        </TableCell>
                        <TableCell align="right">
                          <b>Inactive Companies</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {countryStats.map((row, index) => (
                        <TableRow key={row.country_code || index} hover>
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
              </StyledPaper>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Company Statistics Chart
                </Typography>
                <Box sx={{ height: 400, width: "100%" }}>
                  <ResponsiveContainer>
                    <BarChart data={countryStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country_code" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Total Companies" fill="#8884d8" />
                      <Bar dataKey="Active Companies" fill="#82ca9d" />
                      <Bar dataKey="Inactive Companies" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </StyledPaper>
            </Grid>
          </>
        )}

        {/* Companies Data Table with Pagination */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Companies Data
            </Typography>
            {companies && companies.length > 0 ? (
              <>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Safe Number</TableCell>
                        <TableCell>Matched Name</TableCell>
                        <TableCell>Credit Score</TableCell>
                        <TableCell>Credit Limit</TableCell>
                        <TableCell>Turnover Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>Sector</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companies
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((company, index) => (
                          <TableRow key={company.safeNumber || index} hover>
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
                {/* Pagination Controls */}
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  component="div"
                  count={companies.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                />
              </>
            ) : (
              <Typography align="center" sx={{ py: 3 }}>
                No companies data available
              </Typography>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
