import { MqttService } from '../../Services/mqtt.service';
import { NodeData } from '../../Models/nodes/node';
import { EdgeData } from '../../Models/edges/edge';
import { Edge } from '../../Models/edges/edge';
import { GraphService } from '../../Services/graph_services/graph.service';
import { Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import { Node } from '../../Models/nodes/node';
import { timeInterval } from 'rxjs';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
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
                height: '1px',
                width: '1px',
                'font-size': '0.6px',
                'overlay-opacity': 0,
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
            console.log(res);
            var customStyleObject = {
                selector: `#${res.stationId}`,
                style: {
                    content: res.containerId,
                    'background-color': `${res.color}`,
                    'text-valign': 'center',
                    'text-halign': 'center',
                    shape: 'barrel',
                },
            };
            this.customStyle.push(customStyleObject);
            this.renderData();
            // this.customStyle.pop();
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
                padding: 5,
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
        cy.zoomingEnabled(false);
    }
}

// nodes: [
//     { data: { id: 'a'} },

// ],
// edges: [
//     { data: { id: 'ab', source: 'a', target: 'b' } },
// ],
