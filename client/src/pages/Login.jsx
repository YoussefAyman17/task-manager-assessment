import { useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={styles.pageBackground}>
      <Paper elevation={0} sx={styles.card}>
        {/* Logo Icon */}
        <Box sx={styles.logoContainer}>
          <Box sx={styles.logoIcon}>
            <CheckIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
        </Box>

        {/* Custom Tab Toggle */}
        <Box sx={styles.tabContainer}>
          <Button
            fullWidth
            variant="text"
            component={RouterLink}
            to="/register"
            sx={styles.inactiveTab}
          >
            Create account
          </Button>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            sx={styles.activeTab}
          >
            Sign in
          </Button>
        </Box>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{ mb: 0.5, color: "#0F172A", fontWeight: "700" }}
          >
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your workspace.
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="body2" sx={styles.inputLabel}>
              Email address
            </Typography>
            <TextField
              required
              fullWidth
              size="small"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={styles.inputField}
            />
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.75,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "#334155" }}
              >
                Password
              </Typography>
              {/* <Link
                href="#"
                underline="hover"
                variant="body2"
                sx={{ fontWeight: 500 }}
              >
                Forgot password?
              </Link> */}
            </Box>
            <TextField
              required
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={styles.inputField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* <FormControlLabel
            control={<Checkbox size="small" />}
            label={
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.85rem" }}
              >
                Remember me for 30 days
              </Typography>
            }
            sx={{ mb: 3 }}
          /> */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={styles.submitButton}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, color: "text.secondary" }}
          >
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
              fontWeight="bold"
            >
              Create one
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

const styles = {
  pageBackground: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at top left, #F5F3FF 0%, #F8FAFC 100%)",
    p: 2,
  },
  card: {
    p: { xs: 3, sm: 5 },
    width: "100%",
    maxWidth: "460px",
    borderRadius: "24px",
    boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.04)",
    border: "1px solid #F1F5F9",
  },
  logoContainer: { display: "flex", justifyContent: "center", mb: 3 },
  logoIcon: {
    bgcolor: "primary.main",
    width: 48,
    height: 48,
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 14px rgba(124, 58, 237, 0.4)",
  },
  tabContainer: {
    display: "flex",
    bgcolor: "#F8FAFC",
    p: 0.5,
    borderRadius: "12px",
    mb: 4,
    border: "1px solid #E2E8F0",
  },
  activeTab: {
    borderRadius: "8px",
    bgcolor: "white",
    color: "#0F172A",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
    "&:hover": { bgcolor: "white" },
  },
  inactiveTab: {
    borderRadius: "8px",
    color: "#64748B",
    "&:hover": { bgcolor: "transparent", color: "#0F172A" },
  },
  inputLabel: { mb: 0.75, fontWeight: 500, color: "#334155" },
  inputField: {
    "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "white" },
  },
  submitButton: {
    py: 1.5,
    fontSize: "1rem",
    borderRadius: "8px",
    textTransform: "none",
    boxShadow: "0px 4px 14px rgba(124, 58, 237, 0.3)",
  },
};

export default Login;
