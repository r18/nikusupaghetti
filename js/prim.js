var prim_fn = {
  print: function () {
    return node("print",
      function (that) {
        that.log = that.box.text("").attr({
          stroke: "#00ff00",
        }).move(30,90);
        that.constants = {
        };
      },
      function(that){
      },
      function (that, args) {
        console.log(args);
        str = args.toSource();
        that.log.attr({
          text: str
        });
      }, 
      {text:"string"}, 
      {});
  },
  constant: function () {
    return node("const",
      function (that) {
        that.log = that.box.text("Const").attr({
          stroke: "#00ff00",
          y: 40
        });
        that.constants = {
          constant: "constant value"
        };
         
      },
      function(that){
        that.constants.constant = document.getElementById("input").value;
        that.log.attr({text:that.constants.constant});
      },
      function (that, args) {
        return that.constants;
      }, 
      {}, 
      {});
  },
  add: function (){
    return node(
      "Add",
      function(that){
      },
      function(that){

      },
      function(that,args){
        console.log(args);
        var sum = 0;
        for(i in args){
          if(typeof args[i] != "number"){
            for(j in args[i]){
              sum +=Number(args[i][j]);
            }
          } else {
            sum += args[i];
          }
          if(sum ==NaN){
              return "error";
          }
        }
        return sum;
      },
      {arg1:"number",arg2:"number"},
      {});
  }
};




