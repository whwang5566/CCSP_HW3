//key code
var KEY_ENTER = 13;

$(document).ready(function() {
    // 插入 <ul> 之 <li> 樣板
    var tmpli = '<li><input type="text" placeholder="New Task..."><span></span></li>',
        addButton = $('#add'),
        connected = $('.connected'),      // 三個 <ul>
        placeholder = $('#placeholder'),  // 三個 <ul> 的容器
        mainUl = $('.main'),              // main <ul>
        deleteUl = $('.delete'),          // delete <ul>
        doneUl = $('.done');              // done <ul>
    
    //save start index
    var tempSortableStartIndex = 0;

    //get items by ajax
    getItems();

    //click add item
    addButton.on('click',function(){
        //add li
        $(tmpli).prependTo(mainUl).addClass('is-editing').find('input').focus();
        
    });
    
    mainUl.on('keyup','input',function(event){
            //which is better than keyCode
            if(event.which === KEY_ENTER){
                //check value
                var inputText = $(this).val();
                var li = $(this).parent('li');
                inputText = inputText.replace(/\s/g, '');
                if(inputText.length != 0){
                    li.find('span').text($(this).val());
                    li.removeClass('is-editing'); 
                    
                    //addItem
                    addItem(li);
                }
                else{
                    alert('Please input text.');
                }
            }
            //end key event
    });
    
    //main ul sortable 
    mainUl.sortable({
        connectWith:connected,
        start:function(event,ui){
            placeholder.attr('class','is-dragging');
            //save start index
            tempSortableStartIndex = ui.item.index();
        },
        stop:function(event,ui){
            placeholder.removeClass('is-dragging');
            
            //update position
            updateItemPosition(ui.item,tempSortableStartIndex);
        }
    });
    
    //delete ul sortable
    deleteUl.sortable({
        connectWith:connected,
        receive:function( event, ui ) {
            ui.item.remove();
            
            //delete item
            deleteItem(ui.item,tempSortableStartIndex);
        }
    });
    
    //done ul sortable
    doneUl.sortable({
        connectWith:connected,
        receive:function(event, ui) {
            //add class
            ui.item.addClass('is-done');
                    
            //add to 
            $(ui.item).appendTo(mainUl);
            
            //update item
            updateItem(ui.item,tempSortableStartIndex);

        }
    });
    
    /*
    //load local storage
    function load() {

        if(!localStorage.todoItems) return;

        var dataArray = [];
        console.log(localStorage.todoItems);
        dataArray = JSON.parse(localStorage.todoItems);
        var i;
        for(i = 0;i<dataArray.length;i++){
            $(tmpli).appendTo(mainUl).addClass(dataArray[i].class).find('span').text(dataArray[i].text);
        }
    }
    */
    
    /*
    //save local storage
    function save() {
        var dataArray = [];

        mainUl.find('li').each(function(){
            var item = new Object();
            item.text = $(this).find('span').text();
            item.class = $(this).attr('class');
            dataArray.push(item);
        });

        //save in local storage
        localStorage.todoItems = JSON.stringify(dataArray);
    }
    */


    //save local storage
    function addItem(liItem) {
        //console.log('using ajax to add new item!');
        var item = new Object();
        item.text = liItem.find('span').text();
        item.class = liItem.attr('class');

        $.ajax({
            url : "/items",
            type : "POST",
            dataType:"text",
            data : item,
            success : function(){
                console.log('Add item success!');
            },
            error: function (){
                console.log('Add item error!');
            }
        });
    }

    //ajax load
    function getItems(){
        //console.log('using ajax to get items!');
        $.ajax({
            url : "/items",
            type : "GET",
            success : function(data){
                console.log('Get items success! status :'+status+" data:"+data);
                var dataArray = JSON.parse(data);
                for(i = 0;i<dataArray.length;i++){
                    addItemLi(dataArray[i]);
                }
            },
            error: function (jqXHR, textStatus, errorThrown){
                console.log('Get items error! :'+jqXHR+" textStatus:"+textStatus+" errorThrown"+errorThrown);
            }
        });
    }

    //ajax update
    function updateItem(liItem,itemIndex){
        
        var item = new Object();
        item.text = liItem.find('span').text();
        item.class = liItem.attr('class');

        $.ajax({
            url : "/items/"+itemIndex,
            type : "PUT",
            data : item,
            success : function(){
                console.log('Update item success!');
            },
            error: function (){
                console.log('Update item error!');
            }
        });
    }

    //ajax update position
    function updateItemPosition(liItem,startIndex){
        
        var item = new Object();
        item.text = liItem.find('span').text();
        item.class = liItem.attr('class');

        $.ajax({
            url : "/items/"+startIndex+"/reposition/"+liItem.index(),
            type : "PUT",
            data : item,
            success : function(){
                console.log('Update item position success!');
            },
            error: function (){
                console.log('Update item position error!');
            }
        });
    }

    //ajax update position
    function deleteItem(liItem,itemIndex){
        
        var item = new Object();
        item.text = liItem.find('span').text();
        item.class = liItem.attr('class');

        $.ajax({
            url : "/items/"+itemIndex,
            type : "DELETE",
            data : item,
            success : function(){
                console.log('Delete item success!');
            },
            error: function (){
                console.log('Delete item error!');
            }
        });
    }

    //add temp li
    function addItemLi(item){
        $(tmpli).appendTo(mainUl).addClass(item.class).find('span').text(item.text);
    }
    
}());


//