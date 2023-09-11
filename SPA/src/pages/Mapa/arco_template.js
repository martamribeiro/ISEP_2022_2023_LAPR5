import * as THREE from "three";

export default class Arco extends THREE.Mesh  {
    constructor(parameters, armazemA, armazemB, largura) {
        super();
        THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);

        this.up = new THREE.Vector3(0,0,1);

        for(const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, {value: value, writable: true, configurable: true, enumerable: true});
        }

        //Ligacao entre nós
        this.ligacao = armazemA;
        this.ligacao2 = armazemB;

        //Comprimento de projeção no plano OXY
        this.comprimentoProjecao = Math.sqrt(Math.pow((this.ligacao2.x - this.ligacao.x), 2)
            + Math.pow((this.ligacao2.y - this.ligacao.y), 2)) - (armazemA.larguraNo * 1.1) - (armazemA.larguraNo * 1.1);
        
        //desnivel
        this.desnivel = this.ligacao2.z - this.ligacao.z;

        //Comprimento do arco
        this.comprimento = Math.sqrt(Math.pow(this.comprimentoProjecao, 2) + Math.pow(this.desnivel, 2));

        //Orientacao do Arco
        this.orientacao = Math.atan2((this.ligacao2.y - this.ligacao.y), (this.ligacao2.x - this.ligacao.x));

        //Inclinacao do Arco
        this.inclinacao = Math.atan2(this.desnivel, this.comprimentoProjecao);

        //Largura do Arco
        this.larguraArco = largura;


        //Retangulo a representar Arco 
        this.geometry = new THREE.BoxGeometry(this.comprimento, 0.5, this.larguraArco);
        const texture = new THREE.TextureLoader().load( "./armazens/estrada.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        //texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( this.comprimento/7, 1);

        const texture2 = new THREE.TextureLoader().load( "./armazens/estradaLateral.png" );
        texture2.wrapS = THREE.RepeatWrapping;
        this.material = [
            new THREE.MeshBasicMaterial({ color: 0x000000, map:texture2}), 
            new THREE.MeshBasicMaterial({ color: 0x000000, map:texture2}), 
            new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: texture}),
            new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: texture }), 
            new THREE.MeshBasicMaterial({ color: 0x000000, map:texture2}), 
            new THREE.MeshBasicMaterial({ color: 0x000000, map:texture2}), 
        ]
        
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.plane.receiveShadow = true;
        this.plane.castShadow = true;

        this.position.set((this.ligacao.x + this.ligacao2.x) / 2, (this.ligacao.y + this.ligacao2.y) / 2, (this.ligacao.z + this.ligacao2.z) / 2);

        this.rotateX(Math.PI / 2);
        this.rotation.z = this.inclinacao;
        this.rotation.y = this.orientacao;

        

        //this.updateMatrix();
        //this.matrixAutoUpdate = false;
    }
}