var express = require('express');
var router = express.Router();
var request = require('request');
// 数据库
let db = require('../config/mysql');

/**
 * @api {get} /api/role/list 获取角色列表
 * @apiName RoleList
 * @apiGroup Role
 * @apiPermission admin
 * 
 * @apiSampleRequest /api/role/list
 */
router.get('/role/list', function(req, res) {
  let sql = `SELECT * FROM role`;
  db.query(sql, [], function(results) {
    if (!results.length) {
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
      data: results
    });
  });
});
/**
 * @api {post} /api/menu/add/ 添加子菜单
 * @apiName MenuAdd
 * @apiGroup Role
 * @apiPermission admin
 * 
 * @apiParam {String} name 分类名称.
 * @apiParam {Number} pId 父级id.
 * @apiParam {String} path 菜单url地址.
 * 
 * @apiSampleRequest /api/menu/add/
 */
router.post("/menu/add", function(req, res) {
  let {name, pId, path} = req.body;
  let sql = `INSERT INTO MENU (name,pId,path) VALUES (?,?,?) `;
  db.query(sql, [name, pId, path], function(results, fields) {
    //成功
    res.json({
      status: true,
      msg: "success!",
      data: {
        id: results.insertId
      }
    });
  });
});
/**
 * @api {post} /api/menu/delete/ 删除子菜单
 * @apiName MenuDelete
 * @apiGroup Role
 * @apiPermission admin
 * 
 * @apiParam {Number} id 子菜单id.
 * 
 * @apiSampleRequest /api/menu/delete/
 */
router.post("/menu/delete", function(req, res) {
  let sql = `DELETE FROM MENU WHERE id = ?`;
  db.query(sql, [req.body.id], function(results, fields) {
    //成功
    res.json({
      status: true,
      msg: "success!"
    });
  });
});
/**
 * @api {post} /api/menu/update/ 更新子菜单
 * @apiName MenuUpdate
 * @apiGroup Role
 * @apiPermission admin
 * 
 * @apiParam {Number} id 子菜单id.
 * @apiParam { String } name 子菜单名称.
 * @apiParam { String } path 子菜单url地址.
 * 
 * @apiSampleRequest /api/menu/update/
 */
router.post("/menu/update", function(req, res) {
  let {name, path, id} = req.body;
  let sql = `UPDATE MENU SET name = ? , path = ? WHERE id = ? `;
  db.query(sql, [name, path, id], function(results, fields) {
    //成功
    res.json({
      status: true,
      msg: "success!"
    });
  });
});
/**
 * @api {get} /api/menu/sub/ 获取子级菜单
 * @apiName MenunSub
 * @apiGroup Role
 * @apiPermission admin
 * 
 * @apiParam { Number } pId 父级菜单id。 注： 获取一级菜单pId = 1;
 * 
 * @apiSampleRequest /api/menu/sub/
 */
router.get("/menu/sub/", function(req, res) {
  let sql = `SELECT * FROM MENU WHERE pId = ? `;
  db.query(sql, [req.query.pId], function(results, fields) {
    //成功
    res.json({
      status: true,
      msg: "success!",
      data: results
    });
  });
});


module.exports = router;