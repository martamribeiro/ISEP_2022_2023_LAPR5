import * as THREE from 'three';
        import No from "./no_template.js";
        import ElementoLigacao from './elemento_ligacao_template.js';
        import Arco from './arco_template.js';
        import { OrbitControls } from '../../three.js-master/examples/jsm/controls/OrbitControls.js';
        import { GLTFLoader } from '../../three.js-master/examples/jsm/loaders/GLTFLoader.js';
        import { OBJLoader } from '../../three.js-master/examples/jsm/loaders/OBJLoader.js';
        import { MTLLoader } from '../../three.js-master/examples/jsm/loaders/MTLLoader.js';
        import armazens from "./armazens/armazens.json" assert { type: "json" };
        import merge from "./merge.js";
        import {camiaoData} from "./default_data.js";
        import Camiao from "./camiao_template.js";
        import Grafo from "./grafo.js";
        import Animations from "./animacao_template.js";
import { SpotLight } from 'three';
        


//receber parametros do warehouse
export default class RedeViaria  {

    constructor() {
            this.camiaoParameters = merge(true, camiaoData, {});
            this.camiao = new Camiao(this.camiaoParameters);



            THREE.Object3D.DefaultUp.set(0, 0, 1);
            const objLoader = new OBJLoader();

            this.scene = new THREE.Scene();
            //scene.background = new THREE.Color(0x000000);
            const textureBack = new THREE.TextureLoader().load("./armazens/backGround.jpg" );
            this.scene.background = textureBack;
            this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);

            this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
            this.camera.position.set(50, 50, 100);
            this.camera.up.set(0, 0, 1);

            // controls

            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            //this.controls.listenToKeyEvents(window); // optional

            //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

            this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            this.controls.dampingFactor = 0.05;

            this.controls.screenSpacePanning = false;

            this.controls.minDistance = 100;
            this.controls.maxDistance = 500;

            this.controls.maxPolarAngle = Math.PI / 2;

            // world

            const geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1);
            const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });

            let armazemX, armazemY, armazemZ;
        
            let armazensMap = new Map(Object.entries(armazens));
            this.listNos = [];

            let count = 0;
            let verticeGrafos = [];

            this.grafo = new Grafo(count);

            for (let niveis = 0; niveis < armazensMap.size; niveis++) { 
                armazemX = ((50-(-50))/(8.7613-8.2451))*((armazensMap.get(''+ niveis).coordenadas.longitude)-8.2451)+(-50);
                armazemY = ((100/(42.1115-40.8387))*(armazensMap.get(''+ niveis).coordenadas.latitude-40.8387))-50;
                armazemZ = (50/800)*armazensMap.get(''+ niveis).coordenadas.altitude;

                let newWarehouse = new No(0xffff00, 2, armazemX, armazemY, armazemZ, armazensMap.get(''+ niveis).id);
                this.listNos.push(newWarehouse);

                this.scene.add(newWarehouse);

                let scene = this.scene;

                // add blender object
                objLoader.load("./armazens/armazem2.obj", function (object) {
                    object.scale.set(0.007, 0.007, 0.007);
                    object.rotation.set(Math.PI / 2, 0, 0);
                    object.position.set(newWarehouse.x-3.3, newWarehouse.y-4.6, newWarehouse.z+0.5);
                    scene.add(object);
                });


                this.grafo.addVertex(newWarehouse);
            }            

            this.listArcos = [];
            for(let i=0; i<this.listNos.length-1; i++) {
                let newArco = new Arco(0xFF5733, this.listNos[i], this.listNos[i+1], 2.5);
                this.listArcos.push(newArco);
                this.scene.add(newArco);

                this.grafo.addAresta(this.listNos[i], this.listNos[i+1]);
            }


            let flag=0;
            this.listElementos = [];
            for(let i=0; i<this.listArcos.length; i++) {
                
                let newElemento = new ElementoLigacao(0xffff00, this.listNos[i], 0.5, this.listArcos[i], 1);
                this.scene.add(newElemento);

                this.listElementos.push(newElemento);
                    
                let newElemento2 = new ElementoLigacao(0xffff00, this.listNos[i+1], 0.5, this.listArcos[i], 2);                
                this.scene.add(newElemento2);

                this.listElementos.push(newElemento2);
            }


            
            let myMap = new Map(Object.entries(this.getCamioes()));
            for (let niveis = 0; niveis < myMap.size-1; niveis++) {
                let camiao = new Camiao(this.camiaoParameters);
                camiao.object.position.set(0, 50+i, 0);
                //this.scene.add(camiao.object);
            }

            // lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
            this.scene.add(ambientLight);

            const spotLight = new THREE.SpotLight(0xffffff, 1.0, 0.0, Math.PI/3.0, 0.0, new THREE.Vector3(0,0,100), 0.0);
            spotLight.castShadow=true;
            this.scene.add(spotLight);

            

            //

            window.addEventListener('resize', this.onWindowResize());
            document.addEventListener('keydown', event => this.keyChange(event, true));
            document.addEventListener('keyup', event => this.keyChange(event, false));

              
            this.isRunning = false;
    }

    async getCamioes() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        const response = await fetch("http://localhost:3000/api/camioes/camioesExistentes", requestOptions);
        const camioes = await response.json();
        console.log(camioes);

        return camioes;
    }

    update() {
        
            if(!this.isRunning) {
                if(this.camiao.loaded) {
                    this.scene.add(this.camiao.object);
    
                    this.clock = new THREE.Clock();
    
                    //this.animations = new Animations(this.camiao.object, this.camiao.animations);
    
                    this.camiao.position = new THREE.Vector3(this.listElementos[4].position.x, this.listElementos[4].position.y, this.listElementos[4].position.z);
                    this.camiao.object.position.set(this.listElementos[4].position.x, this.listElementos[4].position.y, this.listElementos[4].position.z);

                    this.camiao.object.rotation.x = Math.PI/2;
                    this.camiao.object.up= new THREE.Vector3(0,0,1);

                    this.isRunning = true;
                } 
            }
            else {
                this.camiao.object.up= new THREE.Vector3(0,0,1);
                const deltaT = this.clock.getDelta();
                //this.animations.update(deltaT);

                let directionIncrement = this.camiao.turningSpeed * deltaT;

                if(this.camiao.keyStates.left){
                    this.camiao.direction += directionIncrement;
                    this.camiao.object.rotation.y = THREE.MathUtils.degToRad(this.camiao.direction);
                }
                else if(this.camiao.keyStates.right) {
                    this.camiao.direction -= directionIncrement;
                    this.camiao.object.rotation.y = THREE.MathUtils.degToRad(this.camiao.direction);
                }

                const direction = THREE.MathUtils.degToRad(this.camiao.direction);
                if(this.camiao.keyStates.backward) {
                    const newPosition = new THREE.Vector3((this.camiao.position.x - this.camiao.velocidadeHorizontal*Math.cos(direction)), (this.camiao.position.y - this.camiao.velocidadeHorizontal*Math.sin(direction)), 0.0);
                       
                    let nosGrafo = [...this.grafo.ListaAdjacencias.keys()];
                    for(let i=0; i<this.grafo.ListaAdjacencias.size; i++) {
                    
                        if((Math.pow((newPosition.x - nosGrafo[i].x), 2)+Math.pow((newPosition.y - nosGrafo[i].y), 2))<=Math.pow(nosGrafo[i].larguraNo,2)) {
                            this.camiao.position = newPosition;
                            this.camiao.object.position.set(newPosition.x, newPosition.y, nosGrafo[i].z+(0.5));
                        }
                        
                    }


                    for(let j=0; j<this.listElementos.length;j++) {
                        let elementoX = ((newPosition.x-this.listElementos[j].position.x)*Math.cos(this.listElementos[j].orientacaoElemento)) + ((newPosition.y-this.listElementos[j].position.y)*Math.sin(this.listElementos[j].orientacaoElemento));
                        let elementoY = ((newPosition.y-this.listElementos[j].position.y)*Math.cos(this.listElementos[j].orientacaoElemento)) - ((newPosition.x-this.listElementos[j].position.x)*Math.sin(this.listElementos[j].orientacaoElemento));
                        
    
                        if((elementoX>=0.0 && elementoX<=2.8) && (elementoY>= (-this.listElementos[j].larguraElemento)/2 && elementoY<=(this.listElementos[j].larguraElemento/2))) {
                            console.log("entrou no elemento");
                            //this.camiao.object.rotation.y = this.listElementos[j].orientacaoElemento;
                            this.camiao.position = newPosition;
                            this.camiao.object.position.set(newPosition.x, newPosition.y, this.listElementos[j].position.z + (0.5));
                            
                        }
                    }

                    for(let z=0;z<this.listArcos.length;z++) {
                        let arcoX = ((newPosition.x-this.listArcos[0].position.x)*Math.cos(this.listArcos[0].orientacao)) + ((newPosition.y-this.listArcos[0].position.y)*Math.sin(this.listArcos[0].orientacao));
                        let arcoY = ((newPosition.y-this.listArcos[0].position.y)*Math.cos(this.listArcos[0].orientacao)) - ((newPosition.x-this.listArcos[0].position.x)*Math.sin(this.listArcos[0].orientacao));
                        
                        
    
                        if((arcoX > this.listArcos[z].comprimento) && (arcoX<(this.listArcos[z].comprimento+this.listArcos[z].comprimentoProjecao)) && ((arcoY>=(-this.listArcos[z].larguraArco)/2) && (arcoY<=(this.listArcos[z].larguraArco/2)))) {
                            let newZ = (this.listArcos[z].position.z) + ((arcoX-this.listArcos[z].comprimento)/(this.listArcos[z].comprimentoProjecao*this.listArcos[z].desnivel)) ;
                            this.camiao.position = newPosition;
                            this.camiao.object.position.set(newPosition.x, newPosition.y, newZ);
                            
                            console.log("entrou arco");
                        }
                    }
                    //this.animations.fadeToAction("Walking", 0.2);
                }
                else if(this.camiao.keyStates.forward) {
                    this.currentNo;
                    const newPosition = new THREE.Vector3(this.camiao.position.x + this.camiao.velocidadeHorizontal*Math.cos(direction), this.camiao.position.y + this.camiao.velocidadeHorizontal*Math.sin(direction), 0.0);
                        
                    let nosGrafo = [...this.grafo.ListaAdjacencias.keys()];
                    for(let i=0; i<this.grafo.ListaAdjacencias.size; i++) {
                        
                        if((Math.pow((newPosition.x - nosGrafo[i].x), 2)+Math.pow((newPosition.y - nosGrafo[i].y), 2))<=Math.pow(nosGrafo[i].larguraNo,2)) {
                            this.camiao.position = newPosition;
                            this.camiao.object.position.set(newPosition.x, newPosition.y, nosGrafo[i].z+(0.5));
                            this.currentNo = nosGrafo[i];
                        }
                        
                    }

                    for(let j=0; j<this.listElementos.length;j++) {
                        let elementoX = ((newPosition.x-this.listElementos[j].position.x)*Math.cos(this.listElementos[j].orientacaoElemento)) + ((newPosition.y-this.listElementos[j].position.y)*Math.sin(this.listElementos[j].orientacaoElemento));
                        let elementoY = ((newPosition.y-this.listElementos[j].position.y)*Math.cos(this.listElementos[j].orientacaoElemento)) - ((newPosition.x-this.listElementos[j].position.x)*Math.sin(this.listElementos[j].orientacaoElemento));
                        
    
                        if((elementoX>=0.0 && elementoX<=2.8) && (elementoY>= (-this.listElementos[j].larguraElemento)/2 && elementoY<=(this.listElementos[j].larguraElemento/2))) {
                            console.log("entrou no elemento");
                            //this.camiao.object.rotation.y = this.listElementos[j].orientacaoElemento;
                            this.camiao.position = newPosition;
                            this.camiao.object.position.set(newPosition.x, newPosition.y, this.listElementos[j].position.z + (0.5));
                            
                        }
                    }

                    for(let z=0;z<this.listArcos.length;z++) {
                        let arcoX = ((newPosition.x-this.listArcos[z].position.x)*Math.cos(this.listArcos[z].orientacao)) + ((newPosition.y-this.listArcos[z].position.y)*Math.sin(this.listArcos[z].orientacao));
                        let arcoY = ((newPosition.y-this.listArcos[z].position.y)*Math.cos(this.listArcos[z].orientacao)) - ((newPosition.x-this.listArcos[z].position.x)*Math.sin(this.listArcos[z].orientacao));

                        let proxOrientacao = Math.atan2((newPosition.y-this.camiao.object.position.y),(newPosition.x-this.camiao.object.position.x));
                        if((Math.round(proxOrientacao * 10) / 10) === (Math.round(this.listArcos[z].orientacao * 10) / 10)){
            
                            if((this.listArcos[z].ligacao===this.currentNo) || (this.listArcos[z].ligacao2===this.currentNo)){
                                let newZ = (this.listArcos[z].position.z) + ((arcoX-this.listArcos[z].comprimento)/(this.listArcos[z].comprimentoProjecao*this.listArcos[z].desnivel)) ;
                                this.camiao.position = newPosition;
                                this.camiao.object.rotation.z = this.listArcos[z].inclinacao;
                                this.camiao.object.rotation.y = this.listArcos[z].orientacao;
                                this.camiao.object.position.set(newPosition.x, newPosition.y, newZ);
                                console.log("entrou arco");
                            }
                            
                            
                            
                        }
                        
                        /*if((arcoX >= this.listArcos[z].comprimento) && (arcoX<=(this.listArcos[z].comprimento+this.listArcos[z].comprimentoProjecao)) && ((arcoY>=(-this.listArcos[z].larguraArco)/2) && (arcoY<=(this.listArcos[z].larguraArco/2)))) {
                            let newZ = (this.listArcos[z].position.z) + ((arcoX-this.listArcos[z].comprimento)/(this.listArcos[z].comprimentoProjecao*this.listArcos[z].desnivel)) ;
                            this.camiao.position = newPosition;
                            this.camiao.object.position.set(newPosition.x, newPosition.y, newZ);
                            
                            console.log("entrou arco");
                        }*/
                    }

                    

                    //this.animations.fadeToAction("Walking", 0.2);
                }

                
                
            }  
    }

    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    keyChange(event, state) {
        if(document.activeElement == document.body) {
            if(event.code == "Space" || event.code == "ArrowLeft" || event.code == "ArrowRight" || event.code == "ArrowLeft" || event.code == "ArrowUp" ) {
                event.preventDefault();
            }
            if(event.code == this.camiao.keyCodes.left) {
                this.camiao.keyStates.left = state;
            }else if(event.code == this.camiao.keyCodes.right) {
                this.camiao.keyStates.right = state;
            }else if(event.code == this.camiao.keyCodes.backward) {
                this.camiao.keyStates.backward = state;
            }else if(event.code == this.camiao.keyCodes.forward) {
                this.camiao.keyStates.forward = state;
            }
        }
    }

}    