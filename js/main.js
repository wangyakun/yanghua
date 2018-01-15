/**
 * Created by WYK on 2018/1/13.
 */
var canvas = document.getElementById('canvas');
var cxt = canvas.getContext('2d');

var gridHeight = canvas.height / 4;
var gridWidth = canvas.width / 4;

function Draw(){
    this.drawBackGround = function(){
        cxt.strokeStyle = "red";
        cxt.lineWidth = 1;
        cxt.beginPath();
        for(var i = 0; i < 5 ; i++) {
            cxt.moveTo(0, i * gridHeight);
            cxt.lineTo(canvas.width, i * gridHeight);
            cxt.moveTo(i * gridWidth, 0);
            cxt.lineTo(i * gridWidth, canvas.height);
        }
        cxt.stroke();
        cxt.closePath();
    };

    this.clearAll = function(){
        cxt.clearRect(0, 0, canvas.width, canvas.height);
    };

    this.clearGrid = function(gridNum){
        console.assert(new RegExp('^\\d+$').test(gridNum) && gridNum >= 0 && gridNum <= 15, "illeagle gridNum:" + gridNum);
        gridX = (gridNum % 4) * gridWidth;
        gridY = parseInt(gridNum / 4) * gridWidth;
        cxt.clearRect(gridX, gridY, gridWidth, gridHeight);
    };

    this.drawSelect = function(gridNum){
        console.assert(new RegExp('^\\d+$').test(gridNum) && gridNum >= 0 && gridNum <= 15, "illeagle gridNum:" + gridNum);
        gridX = (gridNum % 4) * gridWidth;
        gridY = parseInt(gridNum / 4) * gridWidth;

        cxt.fillStyle = "#ABCDEF";
        cxt.fillRect(gridX, gridY, gridWidth, gridWidth);
    };

    /*
    * gridNmu:
    * 0 1 2 3
    * 4 5 6 7
    * 8 9 10 11
    * 12 13 14 15
    * obj:
    * -1:shadow
    * 0:null
    * 1-8: dragon1-8
    * 9-16: tiger1-8
    * */
    this.drawGrid = function(gridNum, obj){
        console.assert(new RegExp('^\\d+$').test(gridNum) && gridNum >= 0 && gridNum <= 15, "illeagle gridNum:" + gridNum);
        console.assert(new RegExp('^-?\\d+$').test(obj) && obj >= -1 && obj <= 16, "illeagle obj:" + obj);
        gridX = (gridNum % 4) * gridWidth;
        gridY = parseInt(gridNum / 4) * gridWidth;
        //console.log(gridX + ',' + gridY);
        cxt.strokeStyle = "red";
        cxt.strokeRect(gridX, gridY, gridWidth, gridHeight);
        if(obj == -1){ //阴影
            cxt.strokeStyle = "black";
            cxt.lineWidth = 1;
            cxt.beginPath();
            for(var i = 0; i < 5; i++){
                cxt.moveTo(gridX + i * gridWidth / 5, gridY);
                cxt.lineTo(gridX, gridY + i * gridHeight / 5);
                cxt.moveTo(gridX + i * gridWidth / 5, gridY + gridHeight);
                cxt.lineTo(gridX + gridWidth, gridY + i * gridHeight / 5);
            }
            cxt.stroke();
            cxt.closePath();
        } else if(obj == 0){

        } else if(obj < 9){
            cxt.fillStyle = "yellow";
            cxt.beginPath();
            cxt.arc(gridX + gridWidth / 2, gridY + gridHeight / 2, gridWidth / 4, 0, 360, false);
            cxt.fill();
            cxt.closePath();

            cxt.fillStyle = "black";
            cxt.font="40px 宋体";
            cxt.fillText("龙" + obj, gridX + gridWidth / 2 - 30, gridY + gridHeight / 2 + 10);
        } else { // obj 9-15
            cxt.fillStyle = "green";
            //cxt.strokeStyle = "green";
            cxt.beginPath();
            cxt.arc(gridX + gridWidth / 2, gridY + gridHeight / 2, gridWidth / 4, 0, 360, false);
            cxt.fill();
            //cxt.stroke();
            cxt.closePath();

            cxt.fillStyle = "black";
            cxt.font="40px 宋体";
            cxt.fillText("虎" + obj % 8, gridX + gridWidth / 2 - 30, gridY + gridHeight / 2 + 10);
        }
    };
}

var draw = new Draw();
//draw.drawBackGround();
//draw.drawSelect(3);
//draw.drawGrid(1, -1);
//draw.drawGrid(2, 0);
//draw.drawGrid(3, 3);
//draw.drawGrid(4, 9);

function Action(){
    this.beginGame = function(){
        draw.clearAll();
        draw.drawBackGround();
        for(var i = 0; i < 16; i++){
            draw.drawGrid(i, -1);
        }
    };

    this.openGrid = function(gridNum, obj){
        draw.clearGrid(gridNum);
        draw.drawGrid(gridNum, obj);
    };

    this.selectGrid = function(gridNum, obj){
        draw.drawSelect(gridNum);
        draw.drawGrid(gridNum, obj);
    };

    this.unSelectGrid = function(gridNum, obj){
        draw.clearGrid(gridNum);
        draw.drawGrid(gridNum, obj);
    };

    this.moveGrid = function(fromGridNum, fromObj, toGridNum){
        draw.clearGrid(fromGridNum);
        draw.drawGrid(fromGridNum, 0);
        draw.clearGrid(toGridNum);
        draw.drawGrid(toGridNum, fromObj);
    };

    this.endGame = function(){
        alert("游戏结束！");//todo
    };
}

var action = new Action();
action.beginGame();
action.openGrid(3, 3);
action.moveGrid(4,9,5);
action.selectGrid(8, 10);
action.unSelectGrid(8, 10);
//action.endGame();

function GameStatus(){
    
}
