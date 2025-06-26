const Habit = require("../models/HabitModel");

const getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ owner: req.user._id }); // Fetch habits only for the logged-in user
    res.status(200).json({ habits });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createHabit = async (req, res) => {
  try {
    const habit = await Habit.create({ ...req.body, owner: req.user._id }); // Assign user as owner
    res.status(201).json({ habit });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getHabit = async (req, res) => {
  try {
    const { id: habitId } = req.params;
    const habit = await Habit.findOne({ _id: habitId, owner: req.user._id }); // Only fetch user's own habit

    if (!habit) {
      return res
        .status(404)
        .json({ msg: `No habit found with id: ${habitId}` });
    }

    res.status(200).json({ habit });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const { id: habitId } = req.params;
    const habit = await Habit.findOneAndDelete({
      _id: habitId,
      owner: req.user._id,
    }); // Only delete if user is the owner

    if (!habit) {
      return res
        .status(404)
        .json({ msg: `No habit found with id: ${habitId}` });
    }

    res.status(200).json({ habit });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateHabit = async (req, res) => {
  try {
    const { id: habitId } = req.params;
    const { completed, ...rest } = req.body;

    const habit = await Habit.findOne({ _id: habitId, owner: req.user._id });
    if (!habit) {
      return res
        .status(404)
        .json({ msg: `No habit found with id: ${habitId}` });
    }

    // Update fields
    Object.assign(habit, rest);

    // Handle completionLogs update
    if (typeof completed === "boolean") {
      habit.completed = completed;

      const today = new Date().toDateString();

      const existingLog = habit.completionLogs.find(
        (log) => new Date(log.date).toDateString() === today
      );

      if (existingLog) {
        existingLog.completed = completed;
      } else {
        habit.completionLogs.push({
          date: new Date(),
          completed,
        });
      }
    }

    await habit.save();
    res.status(200).json({ habit });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllHabits,
  createHabit,
  getHabit,
  deleteHabit,
  updateHabit,
};
