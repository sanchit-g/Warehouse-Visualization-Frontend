import { Injectable } from '@angular/core';
import { ContainerPosition } from 'src/app/Models/container/containers';

@Injectable({
    providedIn: 'root'
})
export class ContainerService {

    indexFromScanner!: number;
    indexToScanner!: number;

    constructor() { }

    createContainer(nodePos: ContainerPosition[] | any[], fromScanner: string, toScanner: string) {
        var stage = new createjs.Stage('containerCircle');
        var circle = new createjs.Shape();
        circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);

        this.indexFromScanner = nodePos.findIndex((x) => {
            if (x.id === fromScanner) {
                return true;
            }
            return false;
        });

        this.indexToScanner = nodePos.findIndex((x) => {
            if (x.id === toScanner) {
                return true;
            }
            return false;
        });

        circle.x = nodePos.at(this.indexFromScanner).x;
        circle.y = nodePos.at(this.indexFromScanner).y;

        stage.addChild(circle); stage.update();

        if (nodePos.at(this.indexFromScanner).x == nodePos.at(this.indexToScanner).x) {
            createjs.Tween.get(circle, { loop: true }).to({ visible: false, y: nodePos.at(this.indexToScanner).y }, 2000);
        }
        else if (nodePos.at(this.indexFromScanner).y == nodePos.at(this.indexToScanner).y) {
            createjs.Tween.get(circle, { loop: true }).to({ visible: false, x: nodePos.at(this.indexToScanner).x }, 2000);
        }
        else {
            createjs.Tween.get(circle, { loop: true }).to({ visible: false, x: nodePos.at(this.indexToScanner).x }, 2000);
            createjs.Tween.get(circle, { loop: true }).to({ visible: false, y: nodePos.at(this.indexToScanner).y }, 2000);
        }

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", stage);

    }
}
