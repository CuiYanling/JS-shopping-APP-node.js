var express = require('express');
var router = express.Router();
// 数据库
let db = require('../config/mysql');
/**
 * @api {post} /users/register/ 注册
 * @apiName register 注册
 * @apiGroup User
 * 
 * @apiParam {String} username 用户账户名.
 * @apiParam {String} password 用户密码.
 * 
 * @apiSampleRequest /users/register
 */
router.post('/register/', function(req, res) {
	// 查询账户是否存在
	let sql = `SELECT * FROM USERS WHERE username = ?`
	db.query(sql, [req.body.username], function(results, fields) {
		if(results.length) {
			res.json({
				status: false,
				msg: "账号已经存在！"
			});
			return false;
		}
		let sql = `INSERT INTO USERS (username,password) VALUES (?,?)`
		db.query(sql, [req.body.username, req.body.password], function(results, fields) {
			// 存储成功
			res.json({
				status: true,
				msg: "注册成功！",
				data: {
					id: results.insertId
				}
			});
		})
	});
});
/**
 * @api {post} /users/login/ 登录
 * @apiName login 登录
 * @apiGroup User
 * 
 * @apiParam {String} username 用户账户名.
 * @apiParam {String} password 用户密码.
 * 
 * @apiSampleRequest /users/login
 */

router.post('/login/', function(req, res) {
	let sql = `SELECT * FROM USERS WHERE username = ? AND password = ? `;
	db.query(sql, [req.body.username, req.body.password], function(results, fields) {
		// 账号密码错误
		if(!results.length) {
			res.json({
				status: false,
				msg: "账号或者密码错误！"
			});
			return false;
		}
		// 登录成功
		res.json({
			status: true,
			msg: "登录成功！",
			data: {
				id: results[0].id
			}
		});
	});
});
/**
 * @api {get} /users/info/ 获取个人资料
 * @apiName /info 获取个人资料
 * @apiGroup User
 * 
 * @apiParam {Number} uid 用户id.
 * 
 * @apiSampleRequest /users/info
 */
router.get("/info/", function(req, res) {
	//查询账户数据
	let sql = `SELECT username,nickname,sex,avatar FROM USERS WHERE id = ?`;
	db.query(sql, [req.query.uid], function(results, fields) {
		if(!results.length) {
			res.json({
				status: false,
				msg: "获取失败！"
			});
			return false;
		}
		// 获取成功
		res.json({
			status: true,
			msg: "获取成功！",
			data: results[0]
		});
	})
});
/**
 * @api {post} /users/updateInfo/ 更新个人资料
 * @apiName /updateInfo 更新个人资料
 * @apiGroup User
 * 
 * @apiParam {Number} uid 用户id.
 * @apiParam {String} nickname 昵称.
 * @apiParam {String} sex 性别.
 * @apiParam {String} avatar 头像.
 * 
 * @apiSampleRequest /users/updateInfo
 */
router.post("/updateInfo/", function(req, res) {
	let sql = `UPDATE users SET nickname = ?,sex = ?,avatar = ? WHERE id = ?`
	db.query(sql, [req.body.nickname, req.body.sex, req.body.avatar,req.body.uid], function(results, fields) {
		res.json({
			status: true,
			msg: "修改成功！"
		});
	});
});

/**
 * @api {post} /users/address/add/ 添加收货地址
 * @apiName /address/add/
 * @apiGroup Address
 * 
 * @apiParam {Number} uid 用户id.
 * @apiParam {String} name 收货人姓名.
 * @apiParam {String} tel 电话.
 * @apiParam {String} province 省.
 * @apiParam {String} city 市.
 * @apiParam {String} area 区.
 * @apiParam {String} street 街道.
 * @apiParam {String} code 邮编.
 * @apiParam {Number} isDefault 是否默认 1-默认,0-否.
 * 
 * @apiSampleRequest /users/address/add/
 */
router.post('/address/add', function(req, res) {
	let sql;
	let isDefault = req.body.isDefault;
	if(isDefault == '1') {
		sql = `
		UPDATE addresses SET isDefault = 0 WHERE uid = ${req.body.uid};
		INSERT INTO addresses(uid,name,tel,province,city,area,street,code,isDefault) VALUES(?,?,?,?,?,?,?,?,?);
		`
	} else {
		sql = `INSERT INTO addresses(uid,name,tel,province,city,area,street,code,isDefault) VALUES(?,?,?,?,?,?,?,?,?)`
	}
	db.query(sql, [req.body.uid, req.body.name, req.body.tel, req.body.province, req.body.city, req.body.area, req.body.street, req.body.code, req.body.isDefault], function(results, fields) {
		res.json({
			status: true,
			msg: "添加成功！"
		});
	});
});
/**
 * @api {post} /users/address/delete/ 删除收货地址
 * @apiName /address/delete/
 * @apiGroup Address
 * 
 * @apiParam {Number} id 收货地址id.
 * 
 * @apiSampleRequest /users/address/delete/
 */
router.post("/address/delete/", function(req, res) {
	var sql = `DELETE FROM addresses WHERE id = ? `
	db.query(sql, [req.body.id], function(results, fields) {
		res.json({
			status: true,
			data: results,
			msg: "删除成功！"
		});
	})
})
/**
 * @api {post} /users/address/update/ 修改收货地址
 * @apiName /address/update/
 * @apiGroup Address
 * 
 * @apiParam {Number} id 收货地址id.
 * @apiParam {Number} uid 用户id.
 * @apiParam {String} name 收货人姓名.
 * @apiParam {String} tel 电话.
 * @apiParam {String} province 省.
 * @apiParam {String} city 市.
 * @apiParam {String} area 区.
 * @apiParam {String} street 街道.
 * @apiParam {String} code 邮编.
 * @apiParam {Number} isDefault 是否默认.1-默认,0-否.
 * 
 * @apiSampleRequest /users/address/update/
 */
router.post("/address/update/", function(req, res) {
	let sql;
	let isDefault = req.body.isDefault;
	if(isDefault == '1') {
		sql = `
		UPDATE addresses SET isDefault = 0 WHERE uid = ${req.body.uid};
		UPDATE addresses SET uid = ?,name = ?,tel = ?,province = ?,city = ?,area = ?,street = ?,code = ?,isDefault = ? WHERE id = ?;
		`
	} else {
		sql = `UPDATE addresses SET uid = ?,name = ?,tel = ?,province = ?,city = ?,area = ?,street = ?,code = ?,isDefault = ? WHERE id = ?`
	}
	db.query(sql, [req.body.uid, req.body.name, req.body.tel, req.body.province, req.body.city, req.body.area, req.body.street, req.body.code, req.body.isDefault, req.body.id], function(results, fields) {
		res.json({
			status: true,
			msg: "修改成功！"
		});
	});
})
/**
 * @api {get} /users/address/list/ 获取收货地址列表
 * @apiName /address/list/
 * @apiGroup Address
 * 
 * @apiParam {Number} uid 用户id.
 * 
 * @apiSampleRequest /users/address/list/
 */
router.get('/address/list', function(req, res) {
	var sql = `SELECT * FROM addresses WHERE uid = ? `
	db.query(sql, [req.query.uid], function(results, fields) {
		if(!results.length) {
			res.json({
				status: false,
				msg: "暂无收货地址！"
			});
			return false;
		}
		res.json({
			status: true,
			data: results,
			msg: "获取成功！"
		});
	})
});
/**
 * @api {get} /users/address/detail/ 根据id获取收货地址详情
 * @apiName /address/detail/
 * @apiGroup Address
 * 
 * @apiParam {Number} id 收货地址id.
 * 
 * @apiSampleRequest /users/address/detail/
 */
router.get("/address/detail/", function(req, res) {
	var sql = `SELECT * FROM addresses WHERE id = ? `
	db.query(sql, [req.query.id], function(results, fields) {
		if(!results.length) {
			res.json({
				status: false,
				msg: "暂无收货地址信息！"
			});
			return false;
		}
		res.json({
			status: true,
			data: results[0],
			msg: "获取成功！"
		});
	})
})

module.exports = router;