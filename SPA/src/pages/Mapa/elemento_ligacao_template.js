import * as THREE from "three";

export default class ElementoLigacao extends THREE.Mesh {
    constructor(parameters, noA, larguraElemento, arco, teste) {
        super();
        THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);

        const K_LIGACAO = 1.1;

        for(const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, {value: value, writable: true, configurable: true, enumerable: true});
        }

        this.comprimentoElemento = noA.larguraNo*K_LIGACAO;
        this.larguraElemento = larguraElemento;
        this.orientacaoElemento = arco.orientacao;
        this.direction = arco.inclinacao;

        this.geometry = new THREE.BoxGeometry( 2.8, this.larguraElemento, arco.larguraArco);
        if(teste==1){
            this.geometry.translate(1, 0.0, 0.0);
        } else {
            this.geometry.translate(-1, 0.0, 0.0);
        }
        
        const texture = new THREE.TextureLoader().load( "./armazens/ligacao.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        //texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: texture });
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.plane.receiveShadow = true;
        this.plane.castShadow = true;

        this.initialize(arco, noA);
    }

    initialize(arco, noA) { 
        
        this.position.set(noA.x, noA.y, noA.z);
        this.rotation.x = (Math.PI / 2);
        this.rotation.y = arco.orientacao;

        this.updateMatrix();
        this.matrixAutoUpdate = false;

    }
}