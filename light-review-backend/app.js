const express = require('express');
const Datastore = require('nedb');
const cors = require('cors'); // 引入 cors 模块
const app = express();
const port = 3000;

// 使用 cors 中间件
app.use(cors());

// 解析 JSON 数据
app.use(express.json());

// 初始化 NeDB 数据库
const db = new Datastore({ filename: 'data.db', autoload: true });

// 新增记录
app.post('/add', (req, res) => {
    const { title, content } = req.body;
    const date = new Date().toISOString().split('T')[0]; // 获取当前日期，格式为 YYYY-MM-DD
    const newRecord = {
        title,
        content,
        date
    };

    db.insert(newRecord, (err, newDoc) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(newDoc);
        }
    });
});

// 整合查询功能
app.get('/search', (req, res) => {
    const { title } = req.query;
    let query = {};

    if (title) {
        const regex = new RegExp(title, 'i'); // 不区分大小写的部分匹配
        query = { title: regex };
    }

    db.find(query, (err, docs) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (docs.length === 0) {
                res.status(404).send('No records found');
            } else {
                const randomIndex = Math.floor(Math.random() * docs.length);
                res.status(200).send(docs[randomIndex]);
            }
        }
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});