
// VARIABILI PER DOM
//
var width = window.innerWidth;
var height = window.innerHeight;

// VARIABILI RELATIVE ALL'ALBERO DI INPUT
//
var leftSubTree = [];
var rightSubTree = [];
var inputTree = [];
var postOrderTree = [];
var preOrderTree = [];
var root = null;

// VARIABILI PER H-V DRAWING
//
var leftHvDrawingTree = [];
var rightHvDrawingTree = [];
var dummyDepth = 1;

var HvNode = function(id, left, right, depth, x, y) {
  this.id = id;
  this.left = left;
  this.right = right;
  this.depth = depth;
  this.x = x;
  this.y = y;
};

HvNode.prototype = Object.create(HvNode.prototype);
HvNode.prototype.constructor = HvNode;

// VISITA IN POST-ORDINE DELL'ALBERO BINARIO
//
function postOrder (node) { 

  node.left && postOrder(node.left);

  preOrderTree.push(node);

  node.right && postOrder(node.right);

  postOrderTree.push(node);

}

// CALCOLA LA PROFONDITA' DI OGNI NODO
//
function drawTree(nodes, type){

  if(nodes.length > 0){
    var node = nodes.shift();

    if(!node.left && !node.right){
      var newNode = new HvNode(node.id, node.left, node.right, dummyDepth, 0, 0);

      type == 'LEFT' && leftHvDrawingTree.push(newNode);
      type == 'RIGHT' && rightHvDrawingTree.push(newNode);

      drawTree(nodes, type);

    }else{
      dummyDepth++;
      var newNode = new HvNode(node.id, node.left, node.right, dummyDepth, 0, 0);
      
      type == 'LEFT' && leftHvDrawingTree.push(newNode);
      type == 'RIGHT' && rightHvDrawingTree.push(newNode);

      drawTree(nodes, type);

    }

  }

}

function resizeDepth(hvNodes){
  var maxValue = d3.max(hvNodes, function(d) { return +d.depth});

  hvNodes.forEach(element => {
    element.depth = maxValue - element.depth +1;
    element.y = element.depth*20;
  });

  return hvNodes;

}

/* TODO: TEST!
* @param data 
*/
function updateDrawing(data){

 var body = d3.select("body")
   .attr("width", width)
   .attr("height", height)
 
 svg = body.append("svg")
   .attr("width", width)
   .attr("height", height)
   .append("g")  

 var nodes = svg.selectAll(".node").data(data, function(d){return d.id});

 // Exit clause: Remove elements
 nodes.exit().remove();

 // Enter clause: add new elements
 //
 nodes.enter().append("rect")
     .attr("class", "node")
     .attr("x", function(d) { return 10; })
     .attr("y", function(d) { return d.y })
     .attr("width", 10)
     .attr("height", 10);

}

function updateDrawing2(data){

  var body = d3.select("body")
    .attr("width", width)
    .attr("height", height)
  
  svg = body.append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")  
 
  var nodes = svg.selectAll(".node").data(data, function(d){return d.id});
 
  // Exit clause: Remove elements
  nodes.exit().remove();
 
  // Enter clause: add new elements
  //
  nodes.enter().append("rect")
      .attr("class", "node")
      .attr("x", function(d) { return 100; })
      .attr("y", function(d) { return d.y })
      .attr("width", 10)
      .attr("height", 10);
 
 }

// MAIN FUNCTION
//
function _initFunction(){

  // LEGGI IL FILE JSON DA UN FILE LOCALE
  //
  d3.json("./assets/nodes.json").then( (data) => {
      inputTree = data;

      // RICAVO L'ALBERO IN POST ORDINE
      //
      postOrder(inputTree[0]);

      // PRENDO LA RADICE
      //
      var dummyRoot = postOrderTree.pop();
      root = new HvNode(dummyRoot.id, dummyRoot.left, dummyRoot.right, 0, 0, 0);

      // SUDDIVIDO TRA SOTTOALBERO DESTRO E SINISTRO
      //
      var dummyLeftSubTree = preOrderTree.slice(0, preOrderTree.indexOf(dummyRoot));
      var dummyRightSubTree = preOrderTree.slice(preOrderTree.indexOf(dummyRoot)+1);

      leftSubTree = postOrderTree.filter(value => dummyLeftSubTree.includes(value));
      rightSubTree = postOrderTree.filter(value => dummyRightSubTree.includes(value));
      
      // CALCOLO LA PROFONDITA' DI OGNI NODO
      //
      dummyDepth = 1;
      drawTree(leftSubTree, "LEFT");
      leftHvDrawingTree = resizeDepth(leftHvDrawingTree);
      console.log(leftHvDrawingTree);

      updateDrawing(leftHvDrawingTree);

      dummyDepth = 1;
      drawTree(rightSubTree,  "RIGHT");
      rightHvDrawingTree = resizeDepth(rightHvDrawingTree);
      console.log(rightHvDrawingTree);
                           
  });

}

this._initFunction();

