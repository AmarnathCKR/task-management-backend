const express = require('express');
const validateTask = require('../middlewares/validateTask');
const Column = require('../Database/coloumnSchema');
const Task = require('../Database/taskSchema');
const { taskSchema, columnSchema } = require('../middlewares/yupSchema');
const userAuth = require('../middlewares/userAuth');

const router = express.Router();

router.post('/columns',userAuth, async (req, res) => {
    try {
        const { name } = req.body;
        const column = new Column({ name, user: req.params.id });
        await column.save();
        res.status(201).send(column);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Create Task
router.post('/tasks',userAuth, async (req, res) => {
    try {
        const { title, description, columnId, dueDate } = req.body;
        const task = new Task({ title, description, column: columnId, user: req.params.id, dueDate });
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update Task
router.put('/tasks/:taskId',userAuth, async (req, res) => {
    try {
        const { taskId } = req.params;
        const updates = req.body;
        const task = await Task.findOneAndUpdate({ _id: taskId, user: req.params.id }, updates, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete Task
router.delete('/tasks/:taskId',userAuth, async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findOneAndDelete({ _id: taskId, user: req.params.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get All Tasks for a User
router.get('/tasks', userAuth,async (req, res) => {
    try {
        console.log(req.params.id)
        const tasks = await Task.find({ user: req.params.id }).populate('column user');
        res.status(200).send(tasks);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get All Columns for a User
router.get('/columns', userAuth,async (req, res) => {
    try {
        console.log(req.params.id)
        const columns = await Column.find({ user: req.params.id });
        res.status(200).send(columns);
    } catch (error) {
        res.status(400).send(error);
    }
});



module.exports = router;
