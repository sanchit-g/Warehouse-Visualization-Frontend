import { Component, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  ngOnInit() {
    var cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,

      style: [
        {
          selector: 'node',
          style: {
            'content': 'data(id)',
            'background-color': 'red',
            'text-valign': 'center',
            'text-halign': 'center',
            'shape' : 'barrel'
          } 
        },
        {
          selector: 'edge',
          css: {
            'curve-style': 'bezier',
            // 'target-arrow-shape': ''
            'width':'8x',
          }
        }
      ],

      elements: {
        nodes: [
          { data: { id: 'a' }, position: { x: -100, y: 0 } },
          { data: { id: 'b' }, position: { x: 0, y: 0 } },
          { data: { id: 'c' }, position: { x: 100, y: 0 } },
          { data: { id: 'd' }, position: { x: 100, y: 100 } },
          { data: { id: 'e' }, position: { x: 200, y: 0 } },  
          { data: { id: 'f' }, position: { x: 100, y: -100 } },
        ],
        edges: [
          { data: { id: 'ab', source: 'a', target: 'b' } },
          { data: { id: 'bc', source: 'b', target: 'c' } },
          { data: { id: 'cd', source: 'c', target: 'd' } },
          { data: { id: 'ce', source: 'c', target:'e'  } },
          { data: { id: 'cf', source: 'c', target:'f'  } },
        ]
      },

      layout: {
        name: 'preset',
        padding: 5,
        zoom: 2
      }
    });

    cy.on('tap', 'node', function (evt) {
      console.log(evt.target.id())
    });
  }
}