/**
 * Created by WYK on 2018/1/13.
 */
var canvas = document.getElementById('canvas');
var cxt = canvas.getContext('2d');

var screenWidth = document.documentElement.clientWidth;
var screenHeight = document.documentElement.clientHeight;

canvas.width = screenWidth - (screenWidth % 4);
canvas.height = screenHeight - (screenHeight % 4);

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
        var gridX = (gridNum % 4) * gridWidth;
        var gridY = parseInt(gridNum / 4) * gridHeight;
        cxt.clearRect(gridX, gridY, gridWidth, gridHeight);
    };

    this.drawSelect = function(gridNum){
        console.assert(new RegExp('^\\d+$').test(gridNum) && gridNum >= 0 && gridNum <= 15, "illeagle gridNum:" + gridNum);
        var gridX = (gridNum % 4) * gridWidth;
        var gridY = parseInt(gridNum / 4) * gridHeight;

        cxt.fillStyle = "#ABCDEF";
        cxt.fillRect(gridX, gridY, gridWidth, gridHeight);
        console.log("fill", gridX, gridY, gridWidth, gridHeight);
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
        var gridX = (gridNum % 4) * gridWidth;
        var gridY = parseInt(gridNum / 4) * gridHeight;
        //console.log(gridX + ',' + gridY);
        cxt.strokeStyle = "red";
        cxt.strokeRect(gridX, gridY, gridWidth, gridHeight);
        function drawObj(fillcolor, objText){
            var radius = Math.min(gridWidth, gridHeight) / 4;
            var fontSize = radius * Math.sqrt(2) * 3 / 4;

            cxt.fillStyle = fillcolor;
            cxt.beginPath();
            cxt.arc(gridX + gridWidth / 2, gridY + gridHeight / 2, radius, 0, 360, false);
            cxt.fill();
            cxt.closePath();

            cxt.fillStyle = "black";
            cxt.font = fontSize + "px 微软雅黑";
            cxt.fillText(objText, gridX + gridWidth / 2 - fontSize / 2 - fontSize / 4, gridY + gridHeight / 2 + fontSize / 2 - fontSize / 5);
        }
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
            drawObj("yellow", "龙" + obj);
        } else { // obj 9-15
            drawObj("green", "虎" + (obj - 8 ));
        }
    };

    this.drawEnd = function(text){
        cxt.fillStyle = "pink";
        cxt.fillRect(gridWidth / 2, gridHeight * 3 / 2, gridWidth * 3, gridHeight);

        var fontSize = Math.min(gridHeight * 4 / 5, gridWidth * 3 / 8); // 除8是因为text有7个字,预留个空格
        cxt.fillStyle = "black";
        cxt.font = fontSize + "px 楷体";
        cxt.fillText(text, gridWidth / 2 + fontSize / 2, gridHeight * 2 + fontSize / 2);
    };
}

function Action(){
    this.draw = new Draw();
    this.beginGame = function(){
        this.draw.clearAll();
        this.draw.drawBackGround();
        for(var i = 0; i < 16; i++){
            this.draw.drawGrid(i, -1);
        }
    };

    this.openGrid = function(gridNum, obj){
        this.draw.clearGrid(gridNum);
        this.draw.drawGrid(gridNum, obj);
    };

    this.selectGrid = function(gridNum, obj){
        this.draw.drawSelect(gridNum);
        this.draw.drawGrid(gridNum, obj);
    };

    this.unSelectGrid = function(gridNum, obj){
        this.draw.clearGrid(gridNum);
        this.draw.drawGrid(gridNum, obj);
    };

    this.moveGrid = function(fromGridNum, fromObj, toGridNum){
        this.draw.clearGrid(fromGridNum);
        this.draw.drawGrid(fromGridNum, 0);
        this.draw.clearGrid(toGridNum);
        this.draw.drawGrid(toGridNum, fromObj);
    };

    this.endGame = function(judgeGameOverResult){
        var result = {
           0: "平局",
           1: "龙赢",
           2: "虎赢"
        };
        this.draw.drawEnd("游戏结束！" + result[judgeGameOverResult]);
    };
}

function Utils(){}

Utils.randomNum = function(maxNum, minNum){
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
};

Utils.getRandomSort = function(arr){
    var arrCp = arr.concat();
    var newArr = [];
    for(var i = arrCp.length - 1; i >= 0; i--){
        var pos = this.randomNum(0, i);
        newArr.push(arrCp[pos]);
        arrCp[pos] = arrCp[i];
    }
    return newArr;
};

Utils.range = function ( start,end ){//拷来的，暂未理解
    //var _self = this;
    var length = end - start + 1;
    var step = start - 1;
    return Array.apply(null,{length:length}).map(function (v,i){step++;return step;});
};

function GameStatus(){
    this.chessboard = [];
    this.fogs = [];
    this.currentSelect = -1;
    this.init = function(){
        this.chessboard = Utils.getRandomSort(Utils.range(1,16));
        for(var i = 0; i < 16; i++){
            this.fogs[i] = true;
        }
    };
    //Utils
    this.getCurrSelectObj = function(){
        console.assert(this.currentSelect != -1);
        return this.chessboard[this.currentSelect];
    };
    this.getChessboardWithFog = function(){
        var ret = [];
        for(var i = 0; i < 16; i++){
            if(this.fogs[i]){
                ret[i] = -1;
            } else {
                ret[i] = this.chessboard[i];
            }
        }
        return ret;
    };
    this.getSurvives = function(){ // 0:无用 1-8:龙 9-16:虎
        var survives = [];
        for(var i = 0; i <= 16; i++){
            survives[i] = false;
        }
        for(i = 0; i < 16; i++){
            survives[this.chessboard[i]] = true;
        }
        return survives;
    };
}

var RuleCenter = function(){};
RuleCenter.isNearby = function(gridNum1, gridNum2){
    var x1 = gridNum1 % 4;
    var y1 = parseInt(gridNum1 / 4);
    var x2 = gridNum2 % 4;
    var y2 = parseInt(gridNum2 / 4);
    return ((x1 == x2) && (Math.abs(y1 - y2) == 1)) || ((y1 == y2) && (Math.abs(x1 - x2) == 1));
};

RuleCenter.canEat = function(obj1, obj2){// -1:不能吃 0:同归于尽 1:能吃
    console.assert(new RegExp('^\\d+$').test(obj1) && obj1 >= 0 && obj1 <= 16, "illeagle obj:" + obj1);
    console.assert(new RegExp('^\\d+$').test(obj2) && obj2 >= 0 && obj2 <= 16, "illeagle obj:" + obj2);
    if(obj1 > 8){
        obj1 = obj1 - 8;
    }
    if(obj2 > 8){
        obj2 = obj2 - 8;
    }

    if(obj1 == obj2){
        return 0;
    } else if((obj1 == 8) && (obj2 == 1)){
        return 1;
    } else if((obj1 == 1) && (obj2 == 8)){
        return -1;
    } else if(obj1 < obj2){
        return 1
    } else { //obj1 > obj2
        return -1;
    }
};

RuleCenter.getClickGridNum = function(x, y){
    var numX = parseInt(x / gridWidth);
    var numY = parseInt(y / gridHeight);
    return numY * 4 + numX;
};

function JudgeCenter(){
    this.initStatus = function(gamestatus){
        this.gameStatus = gamestatus;
    };

    //0:非法 1:打开迷雾 2:选择 3:普通移动 4:吃 5:同归于尽
    JudgeCenter.clickResult = {
        ILLEGAL_SELECT_NULL: -1,
        ILLEGAL_SELECT_ENEMY: -2,
        ILLEGAL_EAT_SELF: -3,
        ILLEGAL_EAT_STRONGER_ENEMY: -4,
        ILLEGAL_NOT_NEARBY: -5,
        OPEN_FOG: 1,
        SELECT: 2,
        MOVE: 3,
        EAT: 4,
        PERISH_TOGETHER: 5
    };
    /*
    turn: 0:龙 1:虎
     */
    this.judgeClick = function(gridNum, turn){
        console.assert(new RegExp('^\\d+$').test(gridNum) && gridNum >= 0 && gridNum <= 15, "illeagle gridNum:" + gridNum);
        console.assert(turn == 0 || turn == 1);
        if(this.gameStatus.fogs[gridNum]){
            return JudgeCenter.clickResult.OPEN_FOG;
        } else {
            var obj = this.gameStatus.chessboard[gridNum];
            var condition_select_self = (turn == 0 && obj > 0 && obj <= 8 || turn == 1 && obj >= 9 && obj <= 16);
            if(this.gameStatus.currentSelect == -1){
                if(condition_select_self){
                    return JudgeCenter.clickResult.SELECT;
                } else if(obj == 0){
                    return JudgeCenter.clickResult.ILLEGAL_SELECT_NULL;
                } else {
                    return JudgeCenter.clickResult.ILLEGAL_SELECT_ENEMY;
                }
            } else {
                var objFrom = this.gameStatus.getCurrSelectObj();
                if(RuleCenter.isNearby(this.gameStatus.currentSelect, gridNum)){
                    if(obj == 0){
                        return JudgeCenter.clickResult.MOVE;
                    } else if(condition_select_self){
                        return JudgeCenter.clickResult.ILLEGAL_EAT_SELF;
                    } else {
                        if(RuleCenter.canEat(objFrom, obj) == 1){
                            return JudgeCenter.clickResult.EAT;
                        } else if(RuleCenter.canEat(objFrom, obj) == 0){
                            return JudgeCenter.clickResult.PERISH_TOGETHER;
                        } else {
                            return JudgeCenter.clickResult.ILLEGAL_EAT_STRONGER_ENEMY;
                        }
                    }
                } else {
                    return JudgeCenter.clickResult.ILLEGAL_NOT_NEARBY;
                }
            }
        }
        console.assert(false, "judge code logic not tight");
    };

    this.judgeGameOver = function(){// -1:没结束 0:平局 1:龙赢 2:虎赢
        var servives = this.gameStatus.getSurvives();
        var servive1 = 0;
        for(var i = 1; i <= 8; i++){
            if(servives[i]){
                servive1++;
            }
        }
        var servive2 = 0;
        for(i = 9; i <= 16; i++){
            if(servives[i]){
                servive2++;
            }
        }
        if(servive1 > 0 && servive2 > 0){
            return -1;
        } else if(servive1 > 0 && servive2 == 0){
            return 1;
        } else if(servive1 == 0 && servive2 > 0){
            return 2;
        } else if(servive1 == 0 && servive2 == 0){
            return 0;
        } else {
            console.assert(false);
        }
    };
}

function LogUtils(){}
LogUtils.logBegin = function(){
    console.log("game begin.");
};
LogUtils.logWanted = function(selectedGridNum, currGridNum, result){
    console.log("from grid:" + selectedGridNum + ", to grid:" + currGridNum);
    if(result == JudgeCenter.clickResult.ILLEGAL_SELECT_NULL){
        console.log("illegal ctrl: 选的是空格子!!!");
    } else if(result == JudgeCenter.clickResult.ILLEGAL_SELECT_ENEMY){
        console.log("illegal ctrl: 选了敌人!!!");
    } else if(result == JudgeCenter.clickResult.ILLEGAL_EAT_SELF){
        console.log("illegal ctrl: 不能吃自己兵!!!");
    } else if(result == JudgeCenter.clickResult.ILLEGAL_EAT_STRONGER_ENEMY){
        console.log("illegal ctrl: 对手比自己强大!!!");
    } else if(result == JudgeCenter.clickResult.ILLEGAL_NOT_NEARBY){
        console.log("illegal ctrl: 格子远了十万八千里!!!");
    } else if(result == JudgeCenter.clickResult.OPEN_FOG){
        console.log("ctrl: 打开迷雾!!!");
    } else if(result == JudgeCenter.clickResult.SELECT){
        console.log("ctrl: 选择!!!");
    } else if(result == JudgeCenter.clickResult.MOVE){
        console.log("ctrl: 移动!!!");
    } else if(result == JudgeCenter.clickResult.EAT){
        console.log("ctrl: 吃掉敌兵!!!");
    } else if(result == JudgeCenter.clickResult.PERISH_TOGETHER){
        console.log("ctrl: 同归于尽!!!");
    } else {
        console.log("未知情况。。。 result:" + result );
    }
};
LogUtils.logCtrlResult = function(succeed){
    if(succeed){
        console.log("执行成功！");
    } else {
        console.log("执行失败！");
    }
};

LogUtils.logGameOver = function(survives){
    console.log("游戏结束！场上情况：");
    var info1 = "";
    var info2 = "";
    var judgeSurvive = {
        true: "存活",
        false: "死亡"
    };
    for(var i = 1; i <= 8; i++){
        info1 += "  龙" + i + ":" + judgeSurvive[survives[i]];
    }
    console.log(info1);
    for(i = 9; i <= 16; i++){
        info2 += "  虎" + (i - 8) + ":" + judgeSurvive[survives[i]];
    }
    console.log(info2);
};

function ControlCenter(){
    var _this = this;
    this.ctl_action = new Action();
    this.gameStatus = new GameStatus();
    this.judgeCenter = new JudgeCenter();
    this.judgeCenter.initStatus(this.gameStatus);
    ControlCenter.gameModes = {
        SINGLE_TAKE_TURNS : 1,
        SINGLE_ROBOT : 2
    };
    this.setGameMode = function(mode){
        this.gameMode = mode;
    };

    this.beginGame = function(){
        this.gameStatus.init();
        this.ctl_action.beginGame();

        this.turn = 0;
        this.gameOver = false;
        LogUtils.logBegin();
    };
    this.refresh = function(){
        this.ctl_action.beginGame();
        for(var i = 0; i < 16; i++){
            if(!this.gameStatus.fogs[i]){
                this.ctl_action.openGrid(i, this.gameStatus.chessboard[i]);
            }
        }
    };
    this.onMouseClickImpl = function(gridNum){
        var obj = this.gameStatus.chessboard[gridNum];
        var judgeResult = this.judgeCenter.judgeClick(gridNum, this.turn);
        LogUtils.logWanted(this.gameStatus.currentSelect, gridNum, judgeResult);

        var fromGridNum = this.gameStatus.currentSelect;
        var fromObj = -1;
        if(fromGridNum != -1){
            fromObj = this.gameStatus.chessboard[fromGridNum];
            this.gameStatus.currentSelect = -1;
            this.ctl_action.unSelectGrid(fromGridNum, fromObj);
        }
        if(judgeResult > 0){
            if(judgeResult == JudgeCenter.clickResult.OPEN_FOG){
                this.gameStatus.fogs[gridNum] = false;
                this.ctl_action.openGrid(gridNum, obj);
            } else if(judgeResult == JudgeCenter.clickResult.SELECT){
                this.gameStatus.currentSelect = gridNum;
                this.ctl_action.selectGrid(gridNum, obj);
                LogUtils.logCtrlResult(true);
                return;
            } else if(judgeResult == JudgeCenter.clickResult.MOVE || judgeResult == JudgeCenter.clickResult.EAT){
                console.assert(fromGridNum != -1);
                this.gameStatus.chessboard[gridNum] = fromObj;
                this.gameStatus.chessboard[fromGridNum] = 0;
                this.ctl_action.moveGrid(fromGridNum, fromObj, gridNum);
            } else if(judgeResult == JudgeCenter.clickResult.PERISH_TOGETHER){
                this.gameStatus.chessboard[gridNum] = 0;
                this.gameStatus.chessboard[fromGridNum] = 0;
                this.ctl_action.moveGrid(fromGridNum, 0, gridNum);
            }
            LogUtils.logCtrlResult(true);
            this.turn = (this.turn + 1) % 2;
            var judgeGameOverResult = this.judgeCenter.judgeGameOver();
            this.gameOver = (judgeGameOverResult >= 0);
            if(this.gameOver){
                LogUtils.logGameOver(this.gameStatus.getSurvives());
                setInterval(this.ctl_action.endGame(judgeGameOverResult), 2000);
            }
        } else {
            LogUtils.logCtrlResult(false);
        }
    };
    this.onMouseClick = function(x, y){
        if(this.gameOver){
            this.beginGame();
        } else {
            if(this.gameMode == ControlCenter.gameModes.SINGLE_ROBOT && this.turn == 1)
                return;
            if(x > canvas.width || y > canvas.height){
                console.log("点了无效区域！");
                return;
            }
            var gridNum = RuleCenter.getClickGridNum(x, y);
            _this.onMouseClickImpl(gridNum);
        }
    };
}

function Robot(){
    var _this = this;
    this.initCtrlCenter = function(ctrlCenter){
        this.ctrlCenter = ctrlCenter;
    };
    this.judgeRobotCtrl = function(){
        //console.log("机器人判断：", this.ctrlCenter.gameMode == ControlCenter.gameModes.SINGLE_ROBOT, this.ctrlCenter.turn == 1);
        return this.ctrlCenter.gameMode == ControlCenter.gameModes.SINGLE_ROBOT && this.ctrlCenter.turn == 1 && !this.ctrlCenter.gameOver;
    };
    this.robotDo = function(){
        console.log("这是机器人");
        var randomGridList = Utils.getRandomSort(Utils.range(0,15));
        for(var i = 0; i < 16; i++) {
            if(this.ctrlCenter.judgeCenter.judgeClick(randomGridList[i], this.ctrlCenter.turn) > 0){
                this.ctrlCenter.onMouseClickImpl(randomGridList[i]);
                return;
            }
        }
    };
    this.robotCtrl = function(){
        if(_this.judgeRobotCtrl()){
            _this.robotDo();
        }
    }
}

function Main(){
    var ctrlCenter = new ControlCenter();
    ctrlCenter.beginGame();
    ctrlCenter.setGameMode(ControlCenter.gameModes.SINGLE_ROBOT);
    console.log(ctrlCenter.gameStatus.chessboard);
    canvas.onclick = function(evt){
        evt=window.event||evt;
        var x = evt.pageX - this.offsetLeft;
        var y = evt.pageY - this.offsetTop;
        ctrlCenter.onMouseClick(x, y);
    };

    var robot = new Robot();
    robot.initCtrlCenter(ctrlCenter);
    setInterval(robot.robotCtrl, 1000);
}

Main();

////test -- 调效果用
//var action = new Action();
//action.beginGame();
//action.openGrid(3, 3);
//action.moveGrid(4,9,5);
//action.selectGrid(8, 10);
//action.unSelectGrid(8, 10);
//action.endGame(1);