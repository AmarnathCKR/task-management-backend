const express = require('express');
const validateTask = require('../../middlewares/validateTask');
const { columnSchema, taskSchema } = require('../../middlewares/yupSchema');
const Column = require('../../Database/coloumnSchema');
const Task = require('../../Database/taskSchema');
const router = express.Router();

router.post('/columns', validateTask(columnSchema), async (req, res) => {
  try {
    const { title, order } = req.body;
    const newColumn = new Column({ title, order });
    await newColumn.save();
    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/columns/:id', validateTask(columnSchema), async (req, res) => {
  try {
    const { title, order } = req.body;
    const column = await Column.findByIdAndUpdate(req.params.id, { title, order }, { new: true });
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }
    res.json(column);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/tasks', validateTask(taskSchema), async (req, res) => {
  try {
    const { title, description, dueDate, column, order } = req.body;
    const newTask = new Task({ title, description, dueDate, column, order });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/tasks/:id', validateTask(taskSchema), async (req, res) => {
  try {
    const { title, description, dueDate, column, order } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { title, description, dueDate, column, order }, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
