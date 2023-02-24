import { Injectable, OnInit } from '@angular/core';
import { ContainerPosition } from 'src/app/Models/container/containers';

@Injectable({
    providedIn: 'root'
})
export class ContainerService {

    indexFromScanner!: number;
    indexToScanner!: number;
    stage!: any;

    constructor() { }

    createStage() {
        this.stage = new createjs.Stage('containerCircle');
    }

    createContainer(nodePos: ContainerPosition[] | any[], fromScanner: string, toScanner: string) {
        var circle = new createjs.Shape();
        circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);

        this.indexFromScanner = nodePos.findIndex((x) => {
            if (x.id == fromScanner) {
                return true;
            }
            return false;
        });

        this.indexToScanner = nodePos.findIndex((x) => {
            if (x.id == toScanner) {
                return true;
            }
            return false;
        });

        circle.x = nodePos.at(this.indexFromScanner).x;
        circle.y = nodePos.at(this.indexFromScanner).y;

        this.stage.addChild(circle);
        this.stage.update();

        if (nodePos.at(this.indexFromScanner).x == nodePos.at(this.indexToScanner).x) {
            createjs.Tween.get(circle, { loop: false }).to({ visible: false, y: nodePos.at(this.indexToScanner).y }, 2000);
        }
        else if (nodePos.at(this.indexFromScanner).y == nodePos.at(this.indexToScanner).y) {
            createjs.Tween.get(circle, { loop: false }).to({ visible: false, x: nodePos.at(this.indexToScanner).x }, 2000);
        }
        else {
            createjs.Tween.get(circle, { loop: false }).to({ visible: false, x: nodePos.at(this.indexToScanner).x }, 2000);
            createjs.Tween.get(circle, { loop: false }).to({ visible: false, y: nodePos.at(this.indexToScanner).y }, 2000);
        }

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", this.stage);
    }
}
