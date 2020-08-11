this.leftSubTree = [];
this.leftVisitClosed = false;

this.rightSubTree = [];
this.rightVisitClosed = true;

this.nodes = [];
this.root = null;

/** 
 * VISITA IN POST-ORDINE DELL'ALBERO BINARIO
 */
function postOrder (node) { 

  node.left && this.postOrder(node.left);

  // SE STO PER VISITARE IL FIGLIO DESTRO DELLA RADICE
  // VUOL DIRE CHE LA VISITA AL SOTTOALBERO SINISTRO
  // E' CONCLUSA
  if(node.id == this.root.id){
    this.leftVisitClosed = true;
    this.rightVisitClosed = false;
  }

  node.right && this.postOrder(node.right);

  // QUANDO ARRIVO AL NODO RADICE
  // VUOL DIRE CHE LA VISITA IN POST ORDINE
  // E' CONCLUSA E CHE LISTE DEI SOTTOALBERI SONO COMPLETE
  if(node.id == this.root.id){
    this.leftVisitClosed = true;
    this.rightVisitClosed = true;
  }

  !this.leftVisitClosed && this.leftSubTree.push(node);
  !this.rightVisitClosed && this.rightSubTree.push(node);

}

/** 
 * MAIN FUNCTION
 */
function _initFunction(){

  // LEGGI IL FILE JSON DA UN FILE LOCALE
  d3.json("./assets/nodes.json").then( (data) => {
      d3.select("p").text("");
      this.nodes = data;
      this.root = nodes[0];

      this.postOrder(this.root);

      console.log(this.leftSubTree);
      console.log(this.rightSubTree);

  });

}

this._initFunction();

