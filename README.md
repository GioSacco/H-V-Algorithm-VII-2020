# H-W Algorithm

Progetto finale dell'esame di Visualizzazione Delle Informazioni 2020.

Il progetto prevede l'implementazione di un algoritmo per produrre hv-drawings di alberi binari. Questa versione segue le indicazioni riportate dall'algoritmo **Right heavy [Crescenzi et al., 92]**.

La logica implementata segue i seguenti passi:

1. Visita in postordine dell'albero binario;

   1. Trasposizione, per ogni nodo dell'albero, del figlio con più nodi alla destra del genitore;

2. Visita in postordine dell'albero per ottenere le coordinate locali di ogni nodo: in questo modo, ogni nodo, avrà delle coordinate
   locali relative unicamente al suo genitore;

3. Visita, dalla radice, di tutto l'albero e impostazione delle coordinate reali a partire dalle coordinate locali seguendo una composizione orizzontale;

4. Calcolo di eventuali confilitti sulle posizioni orizzontali e risoluzione delle stesse. Infatti ogni nodo "destro", quindi con un numero di nodi maggiore, deve lasciare suffiente spazio al corrispondente "fratello sinistro", posto alla sua sinistra; ripetendo questo ricorsivamente per tutti i nodi, si ottiene dunque che l'albero va ad espandersi orizzontalmente mentre si limita l'espansione in altezza.

5. Disegno di nodi e archi tramite D3.js.

Tale soluzione, pur limitando l'espansione in altezza dell'albero, crea problemi in termini di aspect ratio. Difatti, per alcune tipologie di alberi (ex che abbiano un gran numero di figli destri), si avrà una notevole espansione in larghezza non accompagnata però da una corrispondente crescita in altezza.

Per risolvere questo problema è possibile implementare un algoritmo che alterni composizioni verticali e orizzontali. Tuttavia questa modalità è ottima unicamente per gli alberi binari completi (complessità O(n)).
