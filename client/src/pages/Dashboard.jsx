import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  Typography,
  Button,
  Container,
  Grid,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

const initialFormData = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  dueDate: "",
};

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchTasks();
  }, [debouncedSearch, filterStatus, filterPriority]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let query = "?";
      if (filterStatus !== "All") query += `status=${filterStatus}&`;
      if (filterPriority !== "All") query += `priority=${filterPriority}&`;
      if (debouncedSearch) query += `search=${debouncedSearch}`;

      const response = await api.get(`/tasks${query}`);
      setTasks(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully");
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const getSortedTasks = () => {
    let sorted = [...tasks];
    if (sortBy === "Oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "Due Date") {
      sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    return sorted;
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      });
      setEditingId(task._id);
    } else {
      setFormData(initialFormData);
      setEditingId(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.patch(`/tasks/${editingId}`, formData);
        toast.success("Task updated successfully");
      } else {
        await api.post("/tasks", formData);
        toast.success("Task created successfully");
      }
      handleCloseModal();
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE MODAL HANDLERS ---
  const handleOpenDeleteModal = (id) => {
    setTaskToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);

    try {
      await api.delete(`/tasks/${taskToDelete}`);
      toast.success("Task deleted successfully");
      setTasks(tasks.filter((task) => task._id !== taskToDelete));
      handleCloseDeleteModal();
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Done":
        return { bgcolor: "#DCFCE7", color: "#166534" };
      case "In Progress":
        return { bgcolor: "#DBEAFE", color: "#1E40AF" };
      default:
        return { bgcolor: "#F1F5F9", color: "#475569" };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return { bgcolor: "#FEE2E2", color: "#991B1B" };
      case "Medium":
        return { bgcolor: "#FEF3C7", color: "#92400E" };
      default:
        return { bgcolor: "#F3F4F6", color: "#374151" };
    }
  };

  const sortedTasks = getSortedTasks();

  return (
    <Box sx={styles.pageBackground}>
      {/* Sleek Top Navigation */}
      <Box sx={styles.navbar}>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={styles.logoIcon}>
              <AssignmentTurnedInOutlinedIcon
                sx={{ color: "white", fontSize: 20 }}
              />
            </Box>
            <Typography
              variant="h6"
              fontWeight="800"
              sx={{ color: "#0F172A", letterSpacing: "-0.5px" }}
            >
              TaskFlow
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" fontWeight="600" color="#334155">
                {user?.name}
              </Typography>
            </Box>
            <Button
              color="inherit"
              size="small"
              startIcon={<LogoutRoundedIcon />}
              onClick={logout}
              sx={{ color: "#64748B" }}
            >
              Sign out
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{ color: "#0F172A", mb: 0.5 }}
            >
              My Tasks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Here is what's happening with your projects today.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={styles.addButton}
            onClick={() => handleOpenModal()}
          >
            New Task
          </Button>
        </Box>

        {/* --- SEARCH & FILTER BAR --- */}
        <Paper elevation={0} sx={styles.filterBar}>
          <Grid container spacing={2} alignItems="center">
            {/* Search Input */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#94A3B8" }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "8px", bgcolor: "white" },
                }}
              />
            </Grid>

            {/* Filter Controls */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FilterListIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="600"
                >
                  Filters:
                </Typography>
              </Box>

              <TextField
                select
                size="small"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{
                  minWidth: 130,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "white",
                  },
                }}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </TextField>

              <TextField
                select
                size="small"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                sx={{
                  minWidth: 130,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "white",
                  },
                }}
              >
                <MenuItem value="All">All Priorities</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>

              <TextField
                select
                size="small"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  minWidth: 130,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "white",
                  },
                }}
              >
                <MenuItem value="Newest">Sort: Newest</MenuItem>
                <MenuItem value="Oldest">Sort: Oldest</MenuItem>
                <MenuItem value="Due Date">Sort: Due Date</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>
        {/* --- END SEARCH & FILTER BAR --- */}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress sx={{ color: "primary.main" }} />
          </Box>
        ) : sortedTasks.length === 0 ? (
          <Paper elevation={0} sx={styles.emptyState}>
            <AssignmentTurnedInOutlinedIcon
              sx={{ fontSize: 48, color: "#CBD5E1", mb: 2 }}
            />
            <Typography
              variant="h6"
              fontWeight="700"
              color="#0F172A"
              gutterBottom
            >
              {searchQuery || filterStatus !== "All" || filterPriority !== "All"
                ? "No matching tasks found"
                : "No tasks yet"}
            </Typography>
            <Typography variant="body2" color="#64748B" sx={{ mb: 3 }}>
              {searchQuery || filterStatus !== "All" || filterPriority !== "All"
                ? "Try adjusting your search or filters."
                : "Get started by creating a new task to manage your workflow."}
            </Typography>
            {!searchQuery &&
              filterStatus === "All" &&
              filterPriority === "All" && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenModal()}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Create your first task
                </Button>
              )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {sortedTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <Paper elevation={0} sx={styles.taskCard}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Box
                        sx={{ ...styles.tag, ...getStatusStyle(task.status) }}
                      >
                        {task.status}
                      </Box>
                      <Box
                        sx={{
                          ...styles.tag,
                          ...getPriorityStyle(task.priority),
                        }}
                      >
                        {task.priority}
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", mt: -1, mr: -1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          sx={{ color: "#94A3B8" }}
                          onClick={() => handleOpenModal(task)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#94A3B8",
                            "&:hover": { color: "#EF4444" },
                          }}
                          onClick={() => handleOpenDeleteModal(task._id)}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    fontWeight="700"
                    sx={{ color: "#0F172A", lineHeight: 1.3 }}
                  >
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748B",
                      mb: 3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {task.description}
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: "#F1F5F9" }} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#64748B",
                    }}
                  >
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />
                    <Typography variant="caption" fontWeight="600">
                      Due{" "}
                      {new Date(task.dueDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* CREATE / EDIT MODAL (Unchanged) */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 800,
          }}
        >
          {editingId ? "Edit Task" : "Create New Task"}
          <IconButton onClick={handleCloseModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent
            dividers
            sx={{ borderTop: "none", borderBottom: "none", px: 3, py: 1 }}
          >
            <TextField
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2.5 }}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2.5 }}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ sx: { borderRadius: "8px" } }}
                >
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ sx: { borderRadius: "8px" } }}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
              InputProps={{ sx: { borderRadius: "8px" } }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
            <Button
              onClick={handleCloseModal}
              sx={{ color: "#64748B", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                borderRadius: "8px",
                px: 3,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0px 4px 14px rgba(124, 58, 237, 0.3)",
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : editingId ? (
                "Save Changes"
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        PaperProps={{ sx: { borderRadius: "16px", p: 1, maxWidth: "400px" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#0F172A" }}>
          Delete Task?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this task? This action cannot be
            undone and the task will be permanently removed from your dashboard.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDeleteModal}
            disabled={isDeleting}
            sx={{ color: "#64748B", fontWeight: 600, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
            sx={{
              borderRadius: "8px",
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0px 4px 14px rgba(239, 68, 68, 0.3)",
            }}
          >
            {isDeleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const styles = {
  pageBackground: { minHeight: "100vh", background: "#F8FAFC" },
  navbar: {
    height: "72px",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #E2E8F0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logoIcon: {
    bgcolor: "primary.main",
    width: 32,
    height: 32,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 2px 8px rgba(124, 58, 237, 0.4)",
  },
  addButton: {
    py: 1,
    px: 2.5,
    fontSize: "0.9rem",
    borderRadius: "8px",
    textTransform: "none",
    boxShadow: "0px 4px 14px rgba(124, 58, 237, 0.3)",
  },
  filterBar: {
    p: 2,
    mb: 4,
    borderRadius: "16px",
    border: "1px solid #E2E8F0",
    background: "rgba(241, 245, 249, 0.5)",
  },
  emptyState: {
    p: 6,
    textAlign: "center",
    borderRadius: "24px",
    border: "1px dashed #CBD5E1",
    bgcolor: "transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  taskCard: {
    p: 3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: "16px",
    border: "1px solid #F1F5F9",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.06)",
      border: "1px solid #E2E8F0",
    },
  },
  tag: {
    px: 1.5,
    py: 0.5,
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
};

export default Dashboard;
