function main() {
  draw = SVG('box');
  showNodeGenerator();      
}

  var rects = {};

function showNodeGenerator(){
  var i=1;
  for(key in prim_fn){
    nodeGenerator(key,i);
    i++;
  }
}

function nodeGenerator(key,i){
    draw.text(key).move(50,30*i).click(function(){
      addNode(prim_fn[key]);      
    });
    var rect = draw.rect(90,30).attr({
      fill:'#dfcfcf',
      x:50,
      y:30*i,
      opacity:0.4
    });
    rect.on('mousemove',function(){
      rect.fill('#cfbfbf');
    }.bind(key));

    rect.on('mouseout',function(){
      rect.fill('#dfcfcf');
    }.bind(key));

    rect.click(function(){
      addNode(prim_fn[key]());      
    });

}


  
