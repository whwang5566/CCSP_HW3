//require file system
var fs = require('fs');
var dataModel = require('../models/dataModel');

/*
 * GET todo list page
 */

exports.index = function(req, res){
  res.render('todoListView.ejs',{title:'Clear'});
};

/*
 * GET items
 */

exports.getItems = function(req, res){
	dataModel.readItems(res);
};

/*
 * ADD item
 */

exports.addItem = function(req, res){
	dataModel.writeItem(req.body,res);
};

/*
 * UPDATE item
 */

exports.updateItem = function(req, res){
	var itemId = req.params.id;
	dataModel.updateItem(req.body,itemId,res,null);
};

exports.updateItemPosition = function(req, res){
	var itemId = req.params.id;
	var itemNewPosition = req.params.new_position;
	dataModel.updateItem(req.body,itemId,res,itemNewPosition);
};

/*
 * DELETE item
 */

exports.deleteItem = function(req, res){
	var itemId = req.params.id;
	dataModel.deleteItem(req.body,itemId,res);
};