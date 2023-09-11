import * as THREE from "three";

export default class Animations {
    constructor(object, animations) {
        this.states = ["Idle", "Walking","Death"];

        this.mixer = new THREE.AnimationMixer(object);
        this.actionInProgress = false;

        this.actions = {};

        console.log(animations);
        for (let i = 0; i < animations.length; i++) {
            const clip = animations[i];
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;
            if (this.states.indexOf(clip.name) >= 4 ) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
        }
        this.activeName = "Idle";
        this.actions[this.activeName].play();
    }

    fadeToAction(name, duration) {
        if (this.activeName != name && !this.actionInProgress) {
            const previousName = this.activeName;
            this.activeName = name;
            this.actions[previousName].fadeOut(duration);
            this.actions[this.activeName]
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(duration)
                .play();
            // Some actions must not be interrupted
            if (this.activeName != "Idle" && this.activeName != "Walking") {
                this.mixer.addEventListener("finished", event => this.actionFinished(event));
                this.actionInProgress = true;
            }
        }
    }

    actionFinished() {
        if (this.actionInProgress) {
            this.actionInProgress = false;
            this.mixer.removeEventListener("finished", this.actionInProgress);
        }
    }

    update(deltaT) {
        if (this.mixer) {
            this.mixer.update(deltaT);
        }
    }
}