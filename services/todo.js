
const Sequelize = require('sequelize');
const db = require('../services/db');
const Model = Sequelize.Model;
const User = require('../services/user');


class Todo extends Model {
    static async findByID(id) {
        return Todo.findOne({
            where: {
                id,
            }
        })
    }

    static async findAllByUser(userId) {
        return Todo.findAll({
            where:
            {
                userId,
            }
        })
    }

    async makeAsDone() {
        this.isdone = true;
        return this.save();

    }

    static async addTodo(taskname, userId) {

        const newTask = {
            taskname,
            isdone: false,
            userId,
        }
        Todo.create(newTask);
        return newTask;
    }

    static async deleteByID(id, userId) {
        Todo.destroy({
            where: {
                id,
                userId
            }
        })
    }
}

Todo.init({
    taskname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isdone: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
}, {
    sequelize: db,
    modelName: 'todo'
});


User.hasMany(Todo);
Todo.belongsTo(User);

// const addNew = taskname => {
//     const newTask = {
//         id = (todos.length || 0) + 1,
//         taskname: taskname,
//         isdone: False,
//     }
// }

// const getAll = () => todos;
// const findByID = id => todos.find(t => t.id === id);
// const makeAsDone = id => {
//     const currentTask = findByID(id);
//     if (currentTask) {
//         currentTask.isdone = false;
//         return true;
//     }
//     return false;
// }
// const deleteByID = (id) => {
//     //get pos 
//     const pos = todos.indexOf(t => t.id === id);
//     if (pos !== -1) {
//         todos.splice(pos, 1);
//         return true;
//     }
//     return false;
// }

module.exports = Todo;