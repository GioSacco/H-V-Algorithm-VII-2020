
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
var root = null;

// VARIABILI PER H-V DRAWING
//
var hvDrawingTree = [];
var leftDepth = 0;
var rightDepth = 0;

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
  node.right && postOrder(node.right);

  postOrderTree.push(node);

}

function drawTreeTest(localSubTree, localSubTreeRoot, localSubTreeDepth){

      localSubTreeDepth++;

      // RICAVO, SE PRESENTE, IL SOTTOALBERO SINISTRO
      //
      var localLeftSubTree = [];

      var isLeftTree = false;
      for(var i = localSubTree.length-1; i >=0; i--){
        if(localSubTree[i].id < localSubTreeRoot.id || isLeftTree){
          isLeftTree = true;
          localLeftSubTree.push(localSubTree[i]);
        }
      }

      localLeftSubTree.reverse();

      if(localLeftSubTree.length > 0){

        var localLeftRoot = localLeftSubTree.pop();

        var leftLocalRoot = new HvNode(localLeftRoot.id, localLeftRoot.left, localLeftRoot.right, localSubTreeDepth);
        console.log(leftLocalRoot.id +' - '+ leftLocalRoot.depth);

        if(localLeftSubTree.length > 0){
          drawTreeTest(localLeftSubTree, localLeftRoot, localSubTreeDepth);
        }

      }

      // RICAVO, SE PRESENTE, IL SOTTOALBERO DESTRO
      //
      var rightLocalSubTree = [];

      for(var i = localSubTree.length-1; i >=0; i--){
        if((localSubTree[i].id > localSubTreeRoot.id)){
          rightLocalSubTree.push(localSubTree[i]);

        }
      }

      rightLocalSubTree.reverse();

      if(rightLocalSubTree.length > 0){

        var localRightRoot = rightLocalSubTree.pop();

        var rightLocalRoot = new HvNode(localRightRoot.id, localRightRoot.left, localRightRoot.right, localSubTreeDepth);
        console.log(rightLocalRoot.id +' - '+ rightLocalRoot.depth);

        if(rightLocalSubTree.length > 0){
          drawTreeTest(rightLocalSubTree, rightLocalRoot, localSubTreeDepth);
        }

      }


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
      root = new HvNode(dummyRoot.id, dummyRoot.left, dummyRoot.right, 0);

      console.log(root.id +' - '+ root.depth);

      // RICAVO, SE PRESENTE, IL SOTTOALBERO SINISTRO
      //
      var isLeftTree = false;
      for(var i = postOrderTree.length-1; i >=0; i--){
        if(postOrderTree[i].id < root.id || isLeftTree){
          isLeftTree = true;
          leftSubTree.push(postOrderTree[i]);
        }
      }

      leftSubTree.reverse();

      if(leftSubTree.length > 0){
        leftDepth++;

        var localRoot = leftSubTree.pop();

        var leftLocalRoot = new HvNode(localRoot.id, localRoot.left, localRoot.right, leftDepth);
        console.log(leftLocalRoot.id +' - '+ leftLocalRoot.depth);
      
        drawTreeTest(leftSubTree, leftLocalRoot, leftDepth);

      }

      // RICAVO, SE PRESENTE, IL SOTTOALBERO DESTRO
      //
      for(var i = postOrderTree.length-1; i >=0; i--){
        if((postOrderTree[i].id > root.id)){
          rightSubTree.push(postOrderTree[i]);

        }
      }

      rightSubTree.reverse();

      if(rightSubTree.length > 0){
        rightDepth++;

        var localRoot = rightSubTree.pop();

        var rightLocalRoot = new HvNode(localRoot.id, localRoot.left, localRoot.right, rightDepth);
        console.log(rightLocalRoot.id +' - '+ rightLocalRoot.depth);

        drawTreeTest(rightSubTree, rightLocalRoot, rightDepth);

      
      }

                                                
  });

}

this._initFunction();

