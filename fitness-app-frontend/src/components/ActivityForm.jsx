import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { addActivity } from "../services/api";

const ActivityForm = ({ onActivuityAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: 0,
    caloriesBurned: 0,
    additionalMetrics: {},
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    try {
      await addActivity(activity);
      onActivuityAdded();
      setActivity({
        type: "RUNNUING",
        duration: 0,
        caloriesBurned: 0,
      });

      // Assuming addActivity is a function that handles the form submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="activity-type-label">Activity Type</InputLabel>
        <Select
          labelId="activity-type-label"
          value={activity.type}
          onChange={(e) => setActivity({ ...activity, type: e.target.value })}
          label="Activity Type"
        >
          <MenuItem value="RUNNING">Running</MenuItem>
          <MenuItem value="CYCLING">Cycling</MenuItem>
          <MenuItem value="SWIMMING">Swimming</MenuItem>
          <MenuItem value="WALKING">Walking</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Duration (minutes)"
        type="number"
        value={activity.duration}
        onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Calories Burned"
        type="number"
        value={activity.caloriesBurned}
        onChange={(e) =>
          setActivity({ ...activity, caloriesBurned: e.target.value })
        }
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained">
        Add Activity
      </Button>
    </Box>
  );
};

export default ActivityForm;
