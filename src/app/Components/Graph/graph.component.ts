import { MqttService } from '../../Services/mqtt.service';
import { GraphService } from '../../Services/graph_services/graph.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit,AfterViewInit {
    constructor(
        private graphService: GraphService,
        private mqttClientService: MqttService
    ) { }

    queueName: string = 'test_queue';
    nodesData!: any[];
    edgesData!: any[];
    dataCombined: any;
    temp: { nodes: any[]; edges: any[] } = { nodes: [], edges: [] };

    customStyle: any[] = [
        {
            selector: 'node',
            style: {
                'background-color': 'blue',
                'text-valign': 'center',
                'text-halign': 'center',
                'height': '1px',
                'width': '1px',
                'font-size': '0.6px',
            },
        },
        {
            selector: 'edge',
            css: {
                'curve-style': 'bezier',
                width: '0.1px',
                'target-arrow-shape': 'triangle',
                'arrow-scale': '0.03px',
                'overlay-opacity': 0,
            },
        },
        {
            selector: '.highlight',
            css: {
                'background-color': 'red',
            },
        },
    ];

    ngOnInit(): void {
        // setInterval(() => {
        this.getNode();
        this.getStatus();
        // }, 1000);
    }

    ngAfterViewInit(): void {
    
        // var stage = new createjs.Stage('containerCircle');
        
        // var circle = new createjs.Shape();
        // circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 2);
        // circle.x = 35;
        // circle.y = 29; 
        // stage.addChild(circle);    
        // stage.update();
    
        // createjs.Tween.get(circle, { loop: true })
        //   .to({ visible : false, x: 80 }, 2000)
    
        // createjs.Ticker.setFPS(60);
        // createjs.Ticker.addEventListener("tick", stage);
    }

    getNode() {
        this.graphService.getNodes().subscribe((res) => {
            this.temp.nodes = res.nodeDataList;
            console.log(this.temp.nodes);
            
            this.temp.nodes.forEach((node) => {
                var customStyleObject = {
                    selector: `#${node.data.id}`,
                    style: {
                        content: node.data.id,
                        shape: `${node.data.type}`,
                        'background-color': `${node.data.color}`,
                        height: `${node.data.height}`,
                        width: `${node.data.width}`,
                    },
                };
                this.customStyle.push(customStyleObject);
            });
            this.getEdges();
        });
    }

    getEdges() {
        this.graphService.getEdges().subscribe((edge) => {
            this.temp.edges = edge.edgeDataList;
            this.renderData();
        });
    }

    getStatus() {
        this.mqttClientService.getMessages(this.queueName).subscribe((res) => {
            console.log(res);
            var customStyleObject = {
                selector: `#${res.fromScanner}, #${res.toScanner}`,
                style: {
                    content: res.containerId,
                    'background-color': `${res.color}`,
                    'text-valign': 'center',
                    'text-halign': 'center',
                    "font-size" : '0.4px',
                    shape: 'barrel',
                },
            };
            this.customStyle.push(customStyleObject);
            this.renderData();
        });
    }

    renderData() {
        var cy = cytoscape({
            container: document.getElementById('cy'),

            boxSelectionEnabled: false,

            style: this.customStyle,

            elements: {
                nodes: this.temp.nodes,
                edges: this.temp.edges,
            },

            layout: {
                name: 'preset',
                // rows : 2,
            },
        });

        let flag: Boolean;
        flag = true;

        cy.on('tap', 'node', function (evt) {
            if (flag) {
                flag = false;
                evt.target.addClass('highlight');
            } else {
                flag = true;
                evt.target.removeClass('highlight');
            }
        });
        // cy.zoomingEnabled(false);
        // cy.userPanningEnabled(true);
        // cy.$('').ungrabify();
    }
}