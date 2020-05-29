var cron = require('node-cron');
const { sendNews } = require('./services/function');
const News = require('./services/news');
const User = require('./services/user');
// const crawler = require('./crawler');



//at 6:00 AM
var task = cron.schedule('0 6 * * *', async () => {
    const now = new Date();
    var formatNow = now.getDate() - 1 + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
    console.log(formatNow);
    const getNewOnDay = await News.getByDate(formatNow);
    const users = await User.getAll();

    if (users && getNewOnDay) {
        users.forEach(item => {
            setTimeout(async () => { await sendNews(item.id, getNewOnDay) }, 1000);
        })
    }
});

task.start();