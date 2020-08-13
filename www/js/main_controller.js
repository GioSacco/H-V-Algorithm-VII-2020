
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
var leftHvDrawingTreeMap = d3.map();

var rightHvDrawingTree = [];
var rightHvDrawingTreeMap = d3.map();

var HvNode = function(id, left, right, x, y) {
  this.id = id;
  this.left = left;
  this.right = right;
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

function updateNodes(nodeID){

  var node = leftHvDrawingTreeMap.get(nodeID);

  if(node.left && !node.right){

    var childNode = node.left;
    leftHvDrawingTreeMap.set(childNode.id, new HvNode(childNode.id, childNode.left, childNode.right, node.x, node.y+100));

    updateNodes(childNode.id);

  }

  if(!node.left && node.right){

    var childNode = node.right;
    leftHvDrawingTreeMap.set(childNode.id, new HvNode(childNode.id, childNode.left, childNode.right, node.x, node.y+100));

    updateNodes(childNode.id);

  }

  if(node.left && node.right){

    var childRightNode = node.right;
    leftHvDrawingTreeMap.set(childRightNode.id, new HvNode(childRightNode.id, childRightNode.left, childRightNode.right, node.x+100, node.y));
    updateNodes(childRightNode.id);

    var childLeftNode = node.left;
    leftHvDrawingTreeMap.set(childLeftNode.id, new HvNode(childLeftNode.id, childLeftNode.left, childLeftNode.right, node.x, node.y+100));
    updateNodes(childLeftNode.id);

  }

}

function drawTree(subTree){

  subTree.forEach(element => {
    updateNodes(element.id);
  })

}

function drawTreeMap(subTreeList){

  var dummySubTreeMap = d3.map();

  subTreeList.forEach(newNode => {
    dummySubTreeMap.set(newNode.id, new HvNode(newNode.id, newNode.left, newNode.right, 0, 0));
  });

  return dummySubTreeMap;

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
      root = new HvNode(dummyRoot.id, dummyRoot.left, dummyRoot.right, 0, 0);

      // SUDDIVIDO TRA SOTTOALBERO DESTRO E SINISTRO
      //
      var dummyLeftSubTree = preOrderTree.slice(0, preOrderTree.indexOf(dummyRoot));
      var dummyRightSubTree = preOrderTree.slice(preOrderTree.indexOf(dummyRoot)+1);

      leftSubTree = postOrderTree.filter(value => dummyLeftSubTree.includes(value));
      rightSubTree = postOrderTree.filter(value => dummyRightSubTree.includes(value));
      
      // CREA DUE MAP DI SUPPORTO PER L'AGGIORNAMENTO DELLE
      // COORDINATE DEI VARI NODI
      //
      leftHvDrawingTreeMap = drawTreeMap(leftSubTree);
      drawTree(leftSubTree);
      console.log(leftHvDrawingTreeMap);

      updateDrawing(leftHvDrawingTreeMap.values());

      //rightHvDrawingTreeMap = drawTreeMap(rightSubTree);
      //console.log(rightHvDrawingTreeMap);
                           
  });

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
      .attr("x", function(d) { return d.x })
      .attr("y", function(d) { return d.y })
      .attr("width", 10)
      .attr("height", 10);
 
 }

this._initFunction();

