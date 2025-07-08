const express = require("express");
const router = express.Router();

const {
  getHabitLogsByUser,
  updateHabitLogForDate,
} = require("../controllers/habitLogController");
const {
  getAllHabits,
  createHabit,
  getHabit,
  deleteHabit,
  updateHabit,
} = require("../controllers/controllers");
const authMiddleware = require("../middleware/authMiddleware");

// Protect all routes
router
  .route("/")
  .get(authMiddleware, getAllHabits)
  .post(authMiddleware, createHabit);
router
  .route("/:id")
  .get(authMiddleware, getHabit)
  .patch(authMiddleware, updateHabit)
  .delete(authMiddleware, deleteHabit);

router.get("/logs/:userId", authMiddleware, getHabitLogsByUser);
router.post("/:habitId/log", authMiddleware, updateHabitLogForDate);

module.exports = router;
