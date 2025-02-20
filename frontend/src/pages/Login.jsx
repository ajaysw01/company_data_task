// pages/Login.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { login } from "../features/authSlice";

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await dispatch(login(credentials)).unwrap();
      localStorage.setItem("token", response.access_token);
      toast.success(response.message || "Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Invalid credentials");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={credentials.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link to="/register" style={{ textDecoration: "none" }}>
              Don't have an account? Register
            </Link>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Login;
