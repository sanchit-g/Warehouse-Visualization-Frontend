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
    nodePos: ContainerPosition[] = [];
    cy: any;

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