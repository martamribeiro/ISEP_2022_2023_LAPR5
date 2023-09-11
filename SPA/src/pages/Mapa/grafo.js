export default class Grafo {
    constructor(numVertices) {
      this.numVertices = numVertices;
      this.ListaAdjacencias = new Map();
    }
  
    printGraf() {
        var numVertices = this.ListaAdjacencias.keys();
    
        for (var ver of numVertices) {
    
          var getValues = this.ListaAdjacencias.get(ver);
    
          var conjArestas = "";
          for (var i of getValues)
          conjArestas += i + " ";
          console.log(ver + " -> " + conjArestas);
        }
      }

    addAresta(vertex, aresta) {
      this.ListaAdjacencias.get(vertex).push(aresta);
      this.ListaAdjacencias.get(aresta).push(vertex);
    }
  
    addVertex(vertex) {
      this.ListaAdjacencias.set(vertex, []);
    }
  }