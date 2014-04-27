var express = require('express')
  , controller = require('./controllers')
	, app = express();

var port = Number(process.env.PORT || 5000);

//static files
app.use(express.static(__dirname+"/public"))
   .use(express.bodyParser());

//server
app.listen(port);

//set render engine
app.set('view engine','ejs');

//root url
app.get('/', controller.index);

//get all items
app.get('/items', controller.getItems);

//add new items
app.post('/items', controller.addItem);

//update item state
app.put('/items/:id', controller.updateItem);

//update item position
app.put('/items/:id/reposition/:new_position', controller.updateItemPosition);

//delete item position
app.delete('/items/:id', controller.deleteItem);


