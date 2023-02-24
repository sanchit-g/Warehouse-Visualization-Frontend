import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  constructor() { }

  createContainer(nodePos: any[]) {
    var stage = new createjs.Stage('containerCircle');
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);

    circle.x = nodePos.at(1).x;
    circle.y = nodePos.at(1).y;

    stage.addChild(circle);
    stage.update();

    createjs.Tween.get(circle, { loop: true })
      .to({ visible: false, x: nodePos.at(2).x }, 2000)

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);

  }
}
