//require file system
var fs = require('fs');
var dataBuffer;
var filename = './todoItem.json';

/*
 * Array
 */
 Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

/*
 * Data Model
 */

exports.readItems = function(res){
  	//console.log('read files!');
	fs.readFile(filename,'utf8',function(err,data){
		if(err){
			//throw err;
			console.log("Don't have todo json file.");

			//send res
			res.status('404');
			res.end();
		}
		else{
			dataBuffer = JSON.parse(data);
			
			//send res
			res.status('200');
			res.end(data);
		}
	});
};

exports.writeItem = function(item,res){
	//check databuffer
	if(dataBuffer === undefined) dataBuffer = [];
	//add to array
	dataBuffer.unshift(item);

	//convert to json str
	var dataJSONStr = JSON.stringify(dataBuffer);
	
	//write file
	fs.writeFile(filename,dataJSONStr,function(err){
		if(err) {
			res.end('write item error!');
		}
		else{
			res.end('write item success!');
		}
	});
};

exports.updateItem = function(item,itemId,res,newPosition){
	
	//check databuffer
	if(dataBuffer === undefined) dataBuffer = [];

	//check
	if(itemId >= dataBuffer.length) res.end('update item error!');

	//check find
	if((itemId < dataBuffer.length) && (itemId>=0)){

		//re position
		if((newPosition!=undefined) || (newPosition!=null)){
			console.log('Position Update!');
			//set new position
			dataBuffer.move(itemId,newPosition);
			itemId = newPosition;
		}

		//update
		dataBuffer[itemId] = item;

		//convert to json str
		var dataJSONStr = JSON.stringify(dataBuffer);
		
		//write file
		fs.writeFile(filename,dataJSONStr,function(err){
			if(err) {
				res.end('update item error!');
			}
			else{
				res.end('update item success!');
			}
		});
	}
	else{
		res.end('update item error!');
	}
};


exports.deleteItem = function(item,itemId,res){
	
	//check
	if(itemId >= dataBuffer.length) res.end('delete item error!');
	if(itemId<0) res.end('delete item error!');

	//delete
	dataBuffer.splice(itemId,1);

	//convert to json str
	var dataJSONStr = JSON.stringify(dataBuffer);
		
	//write file
	fs.writeFile(filename,dataJSONStr,function(err){
			if(err) {
				res.end('delete item error!');
			}
			else{
				res.end('delete item success!');
			}
	});


};
