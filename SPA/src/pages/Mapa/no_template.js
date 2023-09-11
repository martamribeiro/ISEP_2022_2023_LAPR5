import * as THREE from "three";
import { OBJLoader } from '../../three.js-master/examples/jsm/loaders/OBJLoader.js';

/*
 * parameters = {
 *  color: Integer
 * }
 */

export default class No extends THREE.Mesh {
    constructor(parameters, maxLargura, posX, posY, posZ, idArmazem) {
        super();
        THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);

        for(const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, {value: value, writable: true, configurable: true, enumerable: true});
        }

        //this.up = new THREE.Vector3(0,0,1);

        this.noID = idArmazem;
        this.larguraNo = maxLargura;
        this.x = posX;
        this.y= posY;
        this.z= posZ;
        const K_CIRCULO = 1.5;
      

        /*this.geometry = new THREE.CircleGeometry( this.larguraNo, 32 );
        this.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        this.circle = new THREE.Mesh( this.geometry, this.material );*/

        this.geometry = new THREE.CylinderGeometry( this.larguraNo, this.larguraNo, 1, 32 );
        const textureTop = new THREE.TextureLoader().load( "./armazens/rotunda2.png" );
        textureTop.wrapS = THREE.RepeatWrapping;
        textureTop.wrapT = THREE.RepeatWrapping;
        textureTop.repeat.set( 1, 1);

        const textureSides = new THREE.TextureLoader().load( "./armazens/relva.jpg" );
        textureSides.wrapS = THREE.RepeatWrapping;
        //texture.wrapT = THREE.RepeatWrapping;
        textureSides.repeat.set( 5, 1);

        this.material = [
            new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: textureSides }),
            new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: textureTop }),
            new THREE.MeshBasicMaterial({ color: 0xFFFFFF, map: textureSides })
        ]
        this.cylinder = new THREE.Mesh( this.geometry, this.material );
        this.cylinder.receiveShadow = true;
        this.cylinder.castShadow = true;
        

        this.initialize();
    }

    initialize() {
        this.center = new THREE.Vector3(this.x, this.y, this.z);
        

        this.position.set(this.center.x, this.center.y, this.center.z);
        this.rotateX(Math.PI / 2);
        
       
    }
}