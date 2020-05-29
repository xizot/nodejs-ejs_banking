const express = require('express');
const router = express.Router();

const asyncHandler = require('express-async-handler');
const Todo = require('../services/todo');


//add task
router.post('/task', asyncHandler(async (req, res) => {
    if (req.currentUser) {
        const taskname = req.body.taskname;
        if (taskname.length) {
            const newTask = await Todo.addTodo(req.body.taskname, req.currentUser.id);
            console.log(newTask);
            return res.json(newTask);
        }
        else {

        }
    }
    return res.redirect('/login');
}))
//update task by id
router.post('/update/:id', asyncHandler(async (req, res) => {
    if (req.currentUser) {
        const id = req.param('id');
        const task = await Todo.findByID(id);
        if (task) {
            await task.makeAsDone();
        }
        return res.end('updated');
    }
    else {
        return res.redirect('/login')
    }

}))
//delete task by id
router.post('/delete/:id', asyncHandler(async (req, res) => {

    if (req.currentUser) {

        const id = req.param('id');
        console.log(id);
        await Todo.deleteByID(id, req.currentUser.id);
        return res.end('deleted');

    }
    else {
        return res.redirect('/login')
    }

}))
//get task
router.get('/task', asyncHandler(async (req, res) => {
    if (req.currentUser) {
        const Todos = await Todo.findAllByUser(req.currentUser.id);
        return res.json(Todos);
    }

    return res.redirect('/login')

}))


module.exports = router;