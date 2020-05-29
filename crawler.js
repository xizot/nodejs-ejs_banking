let Parser = require('rss-parser');
let parser = new Parser();
const News = require('./services/news');
const db = require('./services/db');
const getImgLink = link => {
    return link.match(/(?=<a href).*(?<=<\/a>)/gs);
}
const rssLink = ['https://vnexpress.net/rss/tin-moi-nhat.rss', 'https://tuoitre.vn/rss/tin-moi-nhat.rss']

const ncovid = ["covid", "ncovid", "covid-19", "ncov", "ncov-19"];

const crawPost = async linkrss => {
    let feed = await parser.parseURL(linkrss);
    feed.items.forEach(async item => {
        const aboutCV19 = ncovid.some(s => item.title.toLowerCase().includes(s));
        if (aboutCV19) {
            const newItem = {
                link: item.link,
                title: item.title,
                image: getImgLink(item.content).toString(),
                content: item.contentSnippet,
                date: item.pubDate,
            }
            await News.addNew(newItem);
        }

    });
}

const intervalTime = process.env.INTERVAL_TIME || 1 * 1000;


db.sync().then(() => {
    (async () => {
        setInterval(async () => {
            crawPost(rssLink[0]);
            crawPost(rssLink[1]);
        }, intervalTime);
    })();
})
