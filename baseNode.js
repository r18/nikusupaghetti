var draw;
var nodes = [];
var nodeWidth = 150;
var nodeHeight = 250;
var nodeSelectedBGColor = "ff0000";
var nodeBGColor = "cccc00";
var nodeInputWidth = 30;
var nodeInputHeight = 30;
var nodeOutputWidth = 30;
var nodeOutputHeight = 30;
var selected = "";
var arrows = [];
var ctx = AudioContext(); 
var tmp;

function addNode(genNode) {
    //io description
    //node(nodeName,innerFunction,inputs,outputs)
    //
    //Input/Output-------
    //name : type
    nodes.push(genNode);
}

function node(name,init,update,inputs,outputs) {
    var node = {
        selected: false,
        init: function (name,init,update,inputs,outputs) {
            this.inputs = [];
            this.outputs = [];
            this.box = draw.nested().draggable();
            
            this.box.on('mousemove', function (e) {
                if (e.buttons == 1) {
                    //this.update();
                    for (i in this.inputs) {
                        if (this.inputs[i].arrow) {
                            this.inputs[i].arrow.update(null, this.inputs[i].getCenter());
                        }
                    }                    
                    for (i in this.outputs) {
                        if (this.outputs[i].arrow) {
                            this.outputs[i].arrow.update(this.outputs[i].getCenter(),null);
                        }
                    }
                }
            }.bind(this));

            this.box.on('dblclick',function(){console.log("updated");this.update();}.bind(this));
            this.box.rect(150, 200).attr({
                fill: nodeSelectedBGColor,
                'fill-opacity': 0.5,
                stroke: '#000',
                'stroke-width': 1
            });
            tmp = this.box.text(name).attr({
                stroke: '#00ff00',
                x: 70
            });
            init(this);
            this.fn= update;
            this.addInput();
            this.addOutput();
            this.update();
        },
        addInput: function () {
            var input = this.box.rect(nodeInputWidth, nodeInputHeight).attr({
                x: 0,
                y: nodeInputHeight * 2 + this.inputs.length * (nodeInputHeight * 1.2)
            });
            input.io = 'in';

            input.on('mouseover', function (e) {
                this.box.fixed();
                if (e.buttons == 1) {}
            }.bind(this));

            input.on('mouseout', function () {
                this.box.draggable();
            }.bind(this));

            input.on('click', function () {
                if (selected != "" && selected.io == 'out' &&
                   selected.parent != input.parent) {
                    input.arrow = arrow(
                        selected.getCenter(),
                        input.getCenter());
                        selected.arrow = input.arrow;
                    input.childNode = selected.getParent();
                    selected.fill('#000');
                    selected = "";
                    input.fill('#000');
                } else if(selected == input){
                    input.fill('#000');
                    selected = "";
                } else if(selected == ""){
                    selected = input;
                    input.fill('#f06');
                } else {
                    selected.fill('#000');
                    selected = "";
                }
            }.bind(this));

            input.getParent = function(){
              return this;
            }.bind(this);
            input.getCenter = function () {
                return {
                    x: this.box.attr('x') + input.attr('x') + nodeInputWidth / 2,
                    y: this.box.attr('y') + input.attr('y') + nodeInputHeight / 2
                };
            }.bind(this);
            this.inputs.push(input);
        },
        addOutput: function () {
            var output = this.box.rect(nodeOutputWidth, nodeOutputHeight).attr({
                x: nodeWidth - nodeOutputHeight,
                y: nodeOutputHeight * 2 + this.outputs.length * (nodeOutputHeight * 1.2)
            });
            output.io = 'out';

            output.on('mouseover', function (e) {
                this.box.fixed();
                if (e.buttons == 1) {}
            }.bind(this));

            output.on('mouseout', function () {
                this.box.draggable();
            }.bind(this));

            output.on('click', function () {
                if (selected != "" && selected.io == 'in' && 
                    selected.parent != output.parent) {
                    output.arrow = arrow(
                        output.getCenter(),
                        selected.getCenter());
                    selected.arrow = output.arrow;
                    selected.childNode = output.getParent();
                    selected.fill('#000');
                    selected = "";
                    output.fill('#000');
                } else if(selected == output){
                    output.fill('#000');
                    selected = "";
                } else if(selected == ""){
                    selected = output;
                    output.fill('#f06');
                } else {
                    selected.fill('#000');
                    selected = ""
                }
            }.bind(this));

            output.getParent = function(){
              return this;
            }.bind(this);

            output.getCenter = function () {
                return {
                    x: this.box.attr('x') + output.attr('x') + nodeOutputWidth / 2,
                    y: this.box.attr('y') + output.attr('y') + nodeOutputHeight / 2
                };
            }.bind(this);
            this.outputs.push(output);
        },

        collectVal: function(){
          var res = {};
          for(i in this.inputs){
            if(this.inputs[i].childNode != undefined){
              console.log(this.inputs[i].childNode);
              var r = this.inputs[i].childNode.update();
              for(key in r){
                res[key] = r[key];
              }
            }
          }
          for(key in this.constants){
            res[key] = this.constants[key];
          }
          this.args = res;
        }, 
        
        update: function(){
          console.log("evaluated");
          this.collectVal();
          return this.fn(this,this.args);
        },
    };
    node.init(name,init,update,inputs,outputs);
    return node;
}

function arrow(src, dst) {
    var arrow = {
        init: function (src, dst) {
            this.dst = dst;
            this.src = src;
            console.log(this.dst.x + ":" + this.src.x);

            this.draw();
        },

        update: function (src, dst) {
            if (dst != null) this.dst = dst;
            if (src != null) this.src = src;
            this.line.remove();
            this.draw();
        },
        draw: function () {
            this.line = draw.line(this.src.x, this.src.y, this.dst.x, this.dst.y).stroke({
                width: 1
            });

        }
    };
    arrow.init(src, dst);
    return arrow;
}
