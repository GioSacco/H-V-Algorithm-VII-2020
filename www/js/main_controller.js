
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
var leftLinks = [];
var leftNodes = [];
var leftNodesSupport = [];

var rightHvDrawingTree = [];
var rightHvDrawingTreeMap = d3.map();

var actualDepth = 0; // VARIABILE CHE GESTISCE L'ALTERNANZA DI COSTRUZIONI H & V
var maxWidht = 0;
var maxHeight = 0;

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

// DISEGNA IL SOTTOALBERO IN ORIZZONTALE
//
function drawH(subTree, dummyMap, dummyTree){

  var localRoot = dummyMap.get(subTree.pop().id);
  var rightChild = null;
  var leftChild = null;
  var newSubTree = [];

  dummyMap.set(localRoot.id, new HvNode(localRoot.id, localRoot.left, localRoot.right, localRoot.x, localRoot.y));
  newSubTree.push(dummyMap.get(localRoot.id));

  if(localRoot.right){
    rightChild = dummyMap.get(localRoot.right.id);
    dummyMap.set(rightChild.id, new HvNode(rightChild.id, rightChild.left, rightChild.right, localRoot.x+100, localRoot.y));
    newSubTree.push(dummyMap.get(rightChild.id));
  };
  
  if(localRoot.left){
    leftChild = dummyMap.get(localRoot.left.id);
    dummyMap.set(leftChild.id, new HvNode(leftChild.id, leftChild.left, leftChild.right, localRoot.x, localRoot.y+100));
    newSubTree.push(dummyMap.get(leftChild.id));
  };

  newSubTree = newSubTree.reverse();
  dummyTree.push(newSubTree);

}

// DISEGNA IL SOTTOALBERO IN VERTICALE
//
function drawV(subTree){

  var localRoot = subTree.pop();
  var rightChild = localRoot.right;
  var leftChild = localRoot.left;

  rightChild && leftHvDrawingTreeMap.set(rightChild.id, new HvNode(rightChild.id, rightChild.left, rightChild.right, localRoot.x, localRoot.y+100));
  leftChild && leftHvDrawingTreeMap.set(leftChild.id, new HvNode(leftChild.id, leftChild.left, leftChild.right, localRoot.x+200, localRoot.y));

  
}


// PRENDO TUTTI I SOTTOALBERI, IN POSTORDINE, E 
// GENERO LE COORDINATE ALTERNANDO COSTRUZIONI H & V
//
function updateNodes(nodeID, dummyMap, dummyTree){

  var node = dummyMap.get(nodeID);

  if(node){
    
    var localSubTree = [];

    var leftChild = null;
    if(node.left){
      leftChild = dummyMap.get(node.left.id);
    }

    var rightChild = null;
    if(node.right){
      rightChild = dummyMap.get(node.right.id);
    }

    leftChild && localSubTree.push(leftChild);
    rightChild && localSubTree.push(rightChild);

    localSubTree.push(node);

    if(localSubTree.length > 1){
      if(actualDepth % 2 == 0){

        actualDepth = 1;
        drawH(localSubTree, dummyMap, dummyTree);
  
      }else{
  
        actualDepth = 0;
        drawH(localSubTree, dummyMap, dummyTree);
  
      }
    }

  }


}

// CICLA I NODI IN POSTORDINE E INSERISCI LE COORDINATE
//
function drawTree(subTree, dummyMap, dummyTree){

  subTree.forEach(element => {
    updateNodes(element.id, dummyMap, dummyTree);
  })

}

// GENERA UNA MAPPA DI SUPPORTO ID -> NODO
//
function drawTreeMap(subTreeList){

  var dummySubTreeMap = d3.map();

  subTreeList.forEach(newNode => {
    dummySubTreeMap.set(newNode.id, new HvNode(newNode.id, newNode.left, newNode.right, 0, 0));
  });

  return dummySubTreeMap;

}

function reverseCoordinate(subTreeList, dummyMap){
  var reverseSubTree = subTreeList.reverse();

  leftNodes.push(root.left.id); // TODO: CAMBIARE CON ROOT.ID!!!!!!                <---------------------------------------------

  for(var i = 0; i <= reverseSubTree.length-1; i++){

    for(j = i+1; j <= reverseSubTree.length-1; j++){

      var oldNextLocalRoot = reverseSubTree[j][reverseSubTree[j].length-1];

      var newNextLocalRoot = reverseSubTree[i].filter(function(item){ return item.id == oldNextLocalRoot.id })[0];

      if(newNextLocalRoot){

        reverseSubTree[j].pop();
        reverseSubTree[j].push(newNextLocalRoot);

        var lastNewNextLocalRoot = dummyMap.get(newNextLocalRoot.id);

        dummyMap.set(lastNewNextLocalRoot.id, new HvNode(lastNewNextLocalRoot.id, lastNewNextLocalRoot.left, lastNewNextLocalRoot.right, lastNewNextLocalRoot.x, lastNewNextLocalRoot.y));
  
        if(lastNewNextLocalRoot.x == 0){
          leftNodes.push(lastNewNextLocalRoot.id);
        }

        if(maxWidht < lastNewNextLocalRoot.x){
          maxWidht = lastNewNextLocalRoot.x;
        }

        if(maxHeight < lastNewNextLocalRoot.y){
          maxHeight = lastNewNextLocalRoot.y;
        }

        if(lastNewNextLocalRoot.right){
          rightChild = dummyMap.get(newNextLocalRoot.right.id);
        
          if(maxWidht < rightChild.x+lastNewNextLocalRoot.x){
            dummyMap.set(rightChild.id, new HvNode(rightChild.id, rightChild.left, rightChild.right, rightChild.x+lastNewNextLocalRoot.x, lastNewNextLocalRoot.y));

          }else{
            dummyMap.set(rightChild.id, new HvNode(rightChild.id, rightChild.left, rightChild.right, rightChild.x+lastNewNextLocalRoot.x, lastNewNextLocalRoot.y));
          }

          if(maxHeight < lastNewNextLocalRoot.y){
            maxHeight = lastNewNextLocalRoot.y;
          }
        
        };
        
        if(lastNewNextLocalRoot.left){
          leftChild = dummyMap.get(newNextLocalRoot.left.id);
          dummyMap.set(leftChild.id, new HvNode(leftChild.id, leftChild.left, leftChild.right, lastNewNextLocalRoot.x, leftChild.y+lastNewNextLocalRoot.y));
        
          if(maxWidht < lastNewNextLocalRoot.x){
            maxWidht = lastNewNextLocalRoot.x;
          }
  
          if(maxHeight < leftChild.y+lastNewNextLocalRoot.y){
            maxHeight = leftChild.y+lastNewNextLocalRoot.y;
          }
        
        };
      }

    }

  }

  leftNodes.push(postOrderTree[0].id);

}

function createLink(subTree, drawMap){

  var reverseSubTree = subTree.reverse();

  reverseSubTree.forEach(element => {

    if(element.right){
      var rightChild = drawMap.get(element.right.id);
      leftLinks.push([{x: element.x, y: element.y}, {x: rightChild.x, y: rightChild.y}]);
    }

    if(element.left){
      var leftChild = drawMap.get(element.left.id);
      leftLinks.push([{x: element.x, y: element.y}, {x: leftChild.x, y: leftChild.y}]);
    }

  });

}

function getLastNode(node){
  if(node.right){
    getLastNode(node.right);
  }

  leftNodesSupport.push(node);

  if(node.left){
    getLastNode(node.left);
  }

}

function moveOnRight(node, margin, dummyMap){

  var currentNode = dummyMap.get(node.id);
  dummyMap.set(node.id, new HvNode(currentNode.id, currentNode.left, currentNode.right, currentNode.x+margin, currentNode.y));

  if(node.right){
    moveOnRight(currentNode.right, margin, dummyMap);
  }

  if(node.left){
    moveOnRight(currentNode.left, margin, dummyMap);
  }

}

function spliceHTree(dummyMap){

  var rightMargin = 0;

  leftNodes.reverse().forEach(element => {
    var node = dummyMap.get(element);

    if(node.right){

      moveOnRight(node.right, rightMargin, dummyMap);
      leftNodesSupport = [];

      getLastNode(node.right);
      rightMargin = dummyMap.get(leftNodesSupport[0].id).x;
    }

  })



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
      drawTree(leftSubTree, leftHvDrawingTreeMap, leftHvDrawingTree);
      reverseCoordinate(leftHvDrawingTree, leftHvDrawingTreeMap);
      spliceHTree(leftHvDrawingTreeMap);

      leftHvDrawingTree = leftHvDrawingTreeMap.values();

      createLink(leftHvDrawingTree, leftHvDrawingTreeMap);
      updateDrawing(leftHvDrawingTree, leftLinks);
                           
  });

}

/* TODO: TEST!
* @param data 
*/
function updateDrawing(data, dataPoints){

  var y = d3.scaleLinear()
    .domain([0, maxWidht])
    .range([40, 300]);

  var x = d3.scaleLinear()
    .domain([0, maxHeight])
    .range([40, 300]);

  var body = d3.select("body")
    .attr("width", width)
    .attr("height", height)
  
  svg = body.append("svg")
    .attr('width', width)
    .attr('height', height)
    .append("g")  
 
  var nodes = svg.selectAll(".node").data(data, function(d){return d.id});
  var links = svg.selectAll(".links").data(dataPoints, function(d){return d});
  var labels = svg.selectAll(".labels").data(data, function(d){return d});
 
  // Exit clause: Remove elements
  nodes.exit().remove();
  links.exit().remove();
  labels.exit().remove();
 
  // Enter clause: add new elements
  //
  nodes.enter().append("rect")
      .attr("class", "node")
      .attr("x", function(d) { return x(d.x)})
      .attr("y", function(d) { return y(d.y)})
      .attr("fill", "#02366b")
      .attr("width", 40)
      .attr("height", 22)

  links.enter().append("line")
    .attr("class", "links")
    .style("stroke", "#02366b")
    .attr("stroke-width", 3)
    .attr("x1", function(d) { return (x(d[0].x))+20})     
    .attr("y1", function(d) { return (y(d[0].y)+11)})      
    .attr("x2", function(d) { return (x(d[1].x))+20})    
    .attr("y2", function(d) { return (y(d[1].y))+11}); 

  nodes.enter().append("text")
      .attr("class", "labels")
      .attr("x", function(d) { return x(d.x)+19})
      .attr("y", function(d) { return y(d.y)+15})
      .attr("fill", "white")
      .attr("text-anchor", "middle")  
      .style("font-size", "13px")
      .text(function(d){return d.id});
 
 }

this._initFunction();

