import * as THREE from "three";
import { GLTFLoader } from "../../three.js-master/examples/jsm/loaders/GLTFLoader.js";


export default class Camiao {
    constructor(parameters) {
        function onLoad(camiao, description){
            camiao.object = description.scene;
            camiao.animations = description.animations;

            camiao.setShadow(camiao.object);
            //camiao.object.receiveShadow = true;
            //camiao.object.castShadow = true;
            
            const box = new THREE.Box3();
            box.setFromObject(camiao.object);

            const size = new THREE.Vector3();
            box.getSize(size);

            camiao.radius = 1.5*camiao.scale.x;

            camiao.object.scale.set(camiao.scale.x, camiao.scale.y, camiao.scale.z);
            camiao.loaded = true;

            console.log();

            camiao.direction = 0.0;
        }

        function onProgress(url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        function onError(url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        }

        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        this.keyStates = { left: false, right: false, backward: false, forward: false};
        this.loaded = false;

        const loader = new GLTFLoader();


        loader.load(

            this.url,

            description => onLoad(this, description),

            xhr => onProgress(this.url, xhr),

            error => onError(this.url, error)
        );
    }

    setShadow(object) {
        object.traverseVisible(function (child) { // Modifying the scene graph inside the callback is discouraged: https://threejs.org/docs/index.html?q=object3d#api/en/core/Object3D.traverseVisible
            if (child instanceof THREE.Object3D) {
                child.receiveShadow = true;
                child.castShadow = true;
            }
        }); 
    }
}
