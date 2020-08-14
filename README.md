# H-W Algorithm

Progetto finale dell'esame di Visualizzazione Delle Informazioni 2020

Il progetto preve l'implementazione di un algoritmo per produrre hv-drawings di alberi binari. Questa versione segue le policy indicate dall'algoritmo **Right heavy [Crescenzi et al., 92]**.

La logica implementata segue i seguenti passi:

1. Visita in postordine dell'albero binario;

   1. Trasposizione, per ogni nodo dell'albero, del figlio con più nodi alla destra.;

2. Visita in postordine dell'albero per ottenere le coordinate locali di ogni nodo: in questo modo, ogni nodo, avrà delle coordinate
   locali relative unicamente al suo genitore;

3. Visita dalla radice di tutto l'albero e impostazione delle coordinate reali a partire dalle coordinate locali;

4.
