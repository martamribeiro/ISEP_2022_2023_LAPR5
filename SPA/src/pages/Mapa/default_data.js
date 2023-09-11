import * as THREE from "three";

export const gameData = {
    color: 0xffffff,
    position: new THREE.Vector2(0.0, 0.0),
    scale: 1.0,
    end: 10,
    keyCodes: { start: "Space", pause: "Space" } // Start and pause/resume keys
}

export const noData = {
    color: 0xC30909,
    k_ligacao: 1.5,
    larguraArmazem: 3.0
}

export const arcoData = {
    color: 0x09C30C, 
    k_ligacao: 1.1
}

export const elementoLigacaoData = {
    color: 0x1109C3,
    k_ligacao: 1.1
}



export const camiaoData = {
    url: "./models/Componente.glb",
    walkingSpeed: 2.0,
    turningSpeed: 75.0,
    runningFactor: 2.0,
    velocidadeHorizontal: 0.75,
    scale: new THREE.Vector3(0.1, 0.1, 0.1),
    keyCodes: {left: "ArrowLeft", right: "ArrowRight", backward: "ArrowDown", forward: "ArrowUp"}
}