var prim_fn = {
  print: function () {
    return node("print",
      function (that) {
        that.log = that.box.text("").attr({
          stroke: "#00ff00",
          y: 40
        });
        that.constants = {
          text: "hogehoge"
        };
      },
      function (that, args) {
        console.log(args);
        that.log.attr({
          text: args.constant
        });
      }, {
        logVal: ""
      }, {});
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
      function (that, args) {
        console.log(args);
        return that.constants;
      }, {
        logVal: ""
      }, {});
  }
};




