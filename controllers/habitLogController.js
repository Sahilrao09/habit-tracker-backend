const Habit = require("../models/HabitModel");

// Get all logs for a user's habits
const getHabitLogsByUser = async (req, res) => {
  try {
    const habits = await Habit.find({ owner: req.params.userId });

    const logs = habits.flatMap((habit) =>
      habit.completionLogs.map((log) => ({
        habitName: habit.name,
        habitId: habit._id,
        date: log.date,
        completed: log.completed,
      }))
    );

    res.status(200).json({ logs });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch logs" });
  }
};

// Add or update a log for a specific date
const updateHabitLogForDate = async (req, res) => {
  const { date, completed } = req.body;

  try {
    const habit = await Habit.findById(req.params.habitId);
    if (!habit) return res.status(404).json({ msg: "Habit not found" });

    const logIndex = habit.completionLogs.findIndex(
      (log) =>
        new Date(log.date).toDateString() === new Date(date).toDateString()
    );

    if (logIndex !== -1) {
      habit.completionLogs[logIndex].completed = completed;
    } else {
      habit.completionLogs.push({ date, completed });
    }

    await habit.save();
    res.status(200).json({ msg: "Log updated", habit });
  } catch (err) {
    res.status(500).json({ msg: "Error updating log" });
  }
};

module.exports = {
  getHabitLogsByUser,
  updateHabitLogForDate,
};
