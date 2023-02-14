import { MqttService } from './../services/mqtt.service';
import { MqttClientService } from './../mqtt-client.service';
import { NodeData } from './../nodes/node';
import { EdgeData } from './../edges/edge';
import { Edge } from '../edges/edge';
import { GraphService } from './graph_services/graph.service';
import { Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import { Node } from '../nodes/node';
import { timeInterval } from 'rxjs';


@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
    constructor(private graphService: GraphService, private mqttClientService: MqttService) { }

    queueName: string = 'test_queue';
    nodesData!: any[];
    edgesData!: any[];
    dataCombined: any;
    temp: { nodes: any[], edges: any[] } = { nodes: [], edges: [] };

    customStyle: any[] = [
        {
            selector: 'node',
            style: {
                content: 'data(id)',
                'background-color': 'red',
                'text-valign': 'center',
                'text-halign': 'center',
                shape: 'barrel',
            },
        },
        {
            selector: 'edge',
            css: {
                'curve-style': 'bezier',
                width: '8x',
            },
        },
        {
            selector: '.highlight',
            css: {
                'background-color': 'red',
            },
        }
    ];


    ngOnInit(): void {
        // setInterval(() => {
        this.getNode();
        this.getStatus();
        // }, 5000);
    }


    getNode() {
        this.graphService.getNodes().subscribe(res => {
            this.temp.nodes = res.nodeDataList;
            this.getEdges();
        })
    }

    getEdges() {
        this.graphService.getEdges().subscribe(edge => {
            this.temp.edges = edge.edgeDataList;
            // console.log(this.temp.edges);
            this.renderData();
        })
    }

    getStatus() {
        this.mqttClientService.getMessages(this.queueName).subscribe(res => {
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
            }
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
                name: 'grid',
                rows: 2
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
//     { data: { id: 'a' } },
//     { data: { id: 'b' } },
//     { data: { id: 'c' } },
//     { data: { id: 'd' } },
//     { data: { id: 'e' } },
//     { data: { id: 'f' } },
//     { data: { id: 'g' } },
//     { data: { id: 'h' } },
//     { data: { id: 'i' } },

// ],
// edges: [
//     { data: { id: 'ab', source: 'a', target: 'b' } },
//     { data: { id: 'bc', source: 'b', target: 'c' } },
//     { data: { id: 'cd', source: 'c', target: 'd' } },
//     { data: { id: 'de', source: 'd', target: 'e' } },
//     { data: { id: 'bf', source: 'b', target: 'f' } },
//     { data: { id: 'bg', source: 'b', target: 'g' } },
//     { data: { id: 'ch', source: 'c', target: 'h' } },
//     { data: { id: 'ci', source: 'c', target: 'i' } },
//     { data: { id: 'hb', source: 'h', target: 'b' } },
// ],