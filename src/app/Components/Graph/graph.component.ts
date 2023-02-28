import { EdgeData } from './../../Models/edges/edge';
import { NodeData } from './../../Models/nodes/node';
import { ContainerPosition } from './../../Models/container/containers';
import { ContainerService } from '../../Services/ContainerService/container.service';
import { MqttService } from '../../Services/mqtt.service';
import { GraphService } from '../../Services/graph_services/graph.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as createjs from 'createjs-module';
import { NgFor } from '@angular/common';
import { map } from 'rxjs/operators'

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
    constructor(
        private graphService: GraphService,
        private mqttClientService: MqttService,
        private containerService: ContainerService
    ) { }

    queueName: string = 'test_queue';
    temp: { nodes: any[]; edges: any[] } = { nodes: [], edges: [] };
    nodePos: ContainerPosition[] | any[] = [];
    cy: any;

    containerMap: any = new Map<string, string>();
    scannerMap: any = new Map<string, number>();


    getWidth(): any {
        return screen.width;
    }

    getHeight(): any {
        return screen.height;
    }

    customStyle: any[] = [
        {
            selector: 'node',
            style: {
                'background-color': 'blue',
                'text-valign': 'center',
                'text-halign': 'center',
                'color': "black",
                'height': '1px',
                'width': '1px',
                'font-size': '0.5px',
                'border-width': "0.01px",
                'border-color': "black"
            },
        },
        {
            selector: 'edge',
            css: {
                'curve-style': 'bezier',
                width: '0.1px',
                'target-arrow-shape': 'triangle',
                'arrow-scale': '0.03px',
                'opacity': 0.3,
                'overlay-opacity': 0,
                'line-color': "black"
                // #22548B
            },
        },
    ];

    ngOnInit(): void {
        this.containerService.createStage();
        this.getNode();
        this.getStatus();
    }

    getNode() {
        this.graphService.getNodes().subscribe((res) => {
            this.temp.nodes = res.nodeDataList;

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
            var lastPosition = null;
            var scannerCount;

            if (this.containerMap.get(res.containerId) != null) {
                lastPosition = this.containerMap.get(res.containerId);
                var count = this.scannerMap.get(lastPosition);
                this.scannerMap.set(lastPosition, count - 1);
            }

            if (this.scannerMap.get(res.fromScanner) != null) {
                scannerCount = this.scannerMap.get(res.fromScanner);
            }
            else
                scannerCount = 0;

            this.scannerMap.set(res.fromScanner, scannerCount + 1);
            this.containerMap.set(res.containerId, res.fromScanner);

            this.scannerMap.forEach((value: number, key: string) => {
                if (value > 5) {
                    let customStyleObject = {
                        selector: `#${key}`,
                        style: {
                            'background-color': '#EE3124',
                            'color': "#000000"
                        },
                    };
                    this.customStyle.push(customStyleObject);
                }
                else {
                    var customStyleObject = {
                        selector: `#${key}`,
                        style: {
                            'background-color': 'white',
                            'color': "#000000"
                        },
                    };
                    this.customStyle.push(customStyleObject);
                }

            });

            this.containerService.createContainer(this.nodePos, res.fromScanner, res.toScanner);
            this.renderData();
        });
    }

    getContainer() {
        this.temp.nodes.forEach((node) => {
            var tempVariable = this.cy.$(`#${node.data.id}`).renderedPosition();

            var tempNodePos = {
                id: node.data.id,
                x: tempVariable.x,
                y: tempVariable.y
            }

            this.nodePos.push(tempNodePos);
        })
    }

    renderData() {
        this.cy = cytoscape({
            container: document.getElementById('cy'),

            boxSelectionEnabled: false,

            style: this.customStyle,

            elements: {
                nodes: this.temp.nodes,
                edges: this.temp.edges,
            },

            layout: {
                name: 'preset',
            },
        });

        this.cy.zoomingEnabled(false);
        this.cy.userPanningEnabled(false);
        this.cy.$('').ungrabify();

        this.getContainer();
    }
}