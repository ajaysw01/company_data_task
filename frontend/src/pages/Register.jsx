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
import { register } from "../features/authSlice";

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await dispatch(register(formData)).unwrap();
      toast.success(response.message || "Registration successful!");
      navigate("/login");
    } catch (error) {
      // Handle specific FastAPI error responses
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.detail;
        if (Array.isArray(validationErrors)) {
          validationErrors.forEach((err) => {
            toast.error(`${err.loc[1]}: ${err.msg}`);
          });
        } else {
          toast.error("Validation error. Please check your input.");
        }
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(error.message || "Registration failed");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              Already have an account? Login
            </Link>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Register;
