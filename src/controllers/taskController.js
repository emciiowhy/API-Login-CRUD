const prisma = require('../config/prisma');

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'pending',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.userId, // This comes from your JWT middleware!
      },
    });

    res.status(201).json({ message: 'Task created.', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// @desc    Get all tasks for the logged-in user (with optional pagination & status filter)
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Base query: only find tasks belonging to the logged-in user
    const where = { userId: req.user.userId };

    // If a status filter is provided (e.g., ?status=pending), add it to the query
    if (req.query.status) {
      where.status = req.query.status;
    }

    // Run both queries simultaneously: get the tasks and get the total count
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    res.status(200).json({
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// @desc    Get a single task
// @route   GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    // Find task by ID AND ensure it belongs to the user
    const task = await prisma.task.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.userId 
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching task' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    // 1. Verify the task exists and belongs to the user
    const taskExists = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!taskExists) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    // 2. Update the task
    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    res.status(200).json({ message: 'Task updated', task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    // 1. Verify the task exists and belongs to the user
    const taskExists = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!taskExists) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    // 2. Delete the task
    await prisma.task.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};