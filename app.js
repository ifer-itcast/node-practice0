const http = require('http');
const url = require('url');
const querystring = require('querystring');
const app = http.createServer();
// 1. 连接数据库
require('./model/connect');
// 2. 链接用户
const User = require('./model/user');
app.on('request', async (req, res) => {
    const {
        pathname,
        query
    } = url.parse(req.url, true);
    if (req.method === 'GET') {
        // 3. 用户列表
        if (pathname === '/') {
            const users = await User.find();
            let str = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h6>
                        <a href="/add" class="btn btn-primary">添加用户</a>
                    </h6>
                    <table class="table table-striped table-bordered">
                        <tr>
                            <td>用户名</td>
                            <td>年龄</td>
                            <td>爱好</td>
                            <td>邮箱</td>
                            <td>操作</td>
                        </tr>`;
            users.forEach(item => {
                str += `
                <tr>
                    <td>${item.username}</td>
                    <td>${item.age}</td>
                    <td>
                `;
                item.hobbies.forEach(item2 => {
                    str += `
                        <span>${item2}</span>
                    `;
                });
                str += `
                    </td>
                    <td>${item.email}</td>
                    <td>
                        <a href="/delete?id=${item._id}" class="btn btn-danger btn-xs">删除</a>
                        <a href="/modify?id=${item._id}" class="btn btn-success btn-xs">修改</a>
                    </td>
                </tr>
                `;
            });
            str += `
                    </table>
                </div>
            </body>
            </html>
            `;
            res.end(str);
        } else if (pathname === '/add') {
            // 4. 添加用户界面
            let str = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h3>添加用户</h3>
                    <form action="/add" method="POST">
                    <div class="form-group">
                        <label>用户名</label>
                        <input name="username" type="text" class="form-control" placeholder="请填写用户名">
                    </div>
                    <div class="form-group">
                        <label>密码</label>
                        <input name="password" type="password" class="form-control" placeholder="请输入密码">
                    </div>
                    <div class="form-group">
                        <label>年龄</label>
                        <input name="age" type="text" class="form-control" placeholder="请填写邮箱">
                    </div>
                    <div class="form-group">
                        <label>邮箱</label>
                        <input name="email" type="email" class="form-control" placeholder="请填写邮箱">
                    </div>
                    <div class="form-group">
                        <label>请选择爱好</label>
                        <div>
                            <label class="checkbox-inline">
                            <input name="hobbies" type="checkbox" value="足球"> 足球
                            </label>
                            <label class="checkbox-inline">
                            <input name="hobbies" type="checkbox" value="篮球"> 篮球
                            </label>
                            <label class="checkbox-inline">
                            <input name="hobbies" type="checkbox" value="橄榄球"> 橄榄球
                            </label>
                            <label class="checkbox-inline">
                            <input name="hobbies" type="checkbox" value="敲代码"> 敲代码
                            </label>
                            <label class="checkbox-inline">
                            <input name="hobbies" type="checkbox" value="抽烟"> 抽烟
                            </label>
                            <label class="checkbox-inline">
                            <input name="hobbies" type="checkbox" value="喝酒"> 喝酒
                            </label>
                            <label class="checkbox-inline">
                            <input name="hobbies" type="checkbox" value="烫头"> 烫头
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">添加用户</button>
                    </form>
                </div>
            </body>
            </html>
            `;
            res.end(str);
        } else if (pathname === '/modify') {
            // 5. 修改用户界面
            let user = await User.findOne({
                _id: query.id
            });
            let hobbies = ['足球', '篮球', '橄榄球', '敲代码', '抽烟', '喝酒', '烫头'];

            let str = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h3>修改用户</h3>
                    <form action="/modify?id=${query.id}" method="POST">
                    <div class="form-group">
                        <label>用户名</label>
                        <input name="username" value="${user.username}" type="text" class="form-control" placeholder="请填写用户名">
                    </div>
                    <div class="form-group">
                        <label>密码</label>
                        <input name="password" value="${user.password}" type="password" class="form-control" placeholder="请输入密码">
                    </div>
                    <div class="form-group">
                        <label>年龄</label>
                        <input name="age" value="${user.age}" type="text" class="form-control" placeholder="请填写邮箱">
                    </div>
                    <div class="form-group">
                        <label>邮箱</label>
                        <input name="email" value="${user.email}" type="email" class="form-control" placeholder="请填写邮箱">
                    </div>
                    <div class="form-group">
                        <label>请选择爱好</label>
                        <div>
                        `;
            hobbies.forEach(item => {
                if (user.hobbies.includes(item)) {
                    str += `
                    <label class="checkbox-inline">
                    <input name="hobbies" type="checkbox" checked value="${item}"> ${item}
                    </label>`;
                } else {
                    str += `
                    <label class="checkbox-inline">
                    <input name="hobbies" type="checkbox" value="${item}"> ${item}
                    </label>`;
                }
            });
            str += `
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">修改用户</button>
                    </form>
                </div>
            </body>
            </html>
            `;
            res.end(str);
        } else if (pathname === '/delete') {
            // 删除
            await User.findOneAndDelete({
                _id: query.id
            });
            res.writeHead(301, {
                Location: '/'
            });
            res.end();
        }
    } else if (req.method === 'POST') {
        if (pathname === '/add') {
            // 6. 添加用户请求
            let str = '';
            req.on('data', chunk => {
                str += chunk;
            });
            req.on('end', async () => {
                let user = querystring.parse(str);
                await User.create(user);

                res.writeHead(301, {
                    Location: '/'
                });
                res.end();
            });
        } else if(pathname === '/modify') {
            // 修改
            let str = '';
            req.on('data', chunk => {
                str += chunk;
            });
            req.on('end', async () => {
                let user = querystring.parse(str);
                await User.updateOne({
                    _id: query.id
                }, user);

                res.writeHead(301, {
                    Location: '/'
                });
                res.end();
            });
        }
    }
});
app.listen(3000);