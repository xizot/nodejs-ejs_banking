const db = require('./db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;



class News extends Model {
    static async findByID(id) {
        return this.findByID(id);
    }

    static async getPage(page, limit) {
        return this.findAll({
            order: [
                ['date', 'DESC'],
            ],
            offset: page * limit,
            limit: limit,
        });
    }
    static async getAll(page) {
        return this.findAll({
            order: [
                ['date', 'DESC'],
            ],
        });
    }

    static async getByDate(date) {
        console.log(date);
        const get = await this.getAll();
        return get.filter(item => {
            const currentDate = new Date(item.date);
            const formatDate = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
            return formatDate === date;
        })
    }
    static async findByLink(link) {
        return this.findOne({
            where: { link, }
        })
    }

    static async addNew(item) {
        const found = await this.findByLink(item.link);
        if (!found) {
            return this.create(item);
        }
    }
}

News.init({
    link: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    image: {
        type: Sequelize.TEXT,
    },
    content: {
        type: Sequelize.TEXT,
    },
    date: {
        type: Sequelize.DATE,
    }
}, {
    sequelize: db,
    modelName: "news",
})
module.exports = News;