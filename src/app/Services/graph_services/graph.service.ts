import { Edge, EdgeList } from '../../Models/edges/edge';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Node, NodeListResponse } from 'src/app/Models/nodes/node';

@Injectable({
    providedIn: 'root'
})
export class GraphService {

    constructor(private http: HttpClient) {

    }

    getNodes(): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        })
        return this.http.get<any>(`${environment.baseUrl}${environment.getNodeData}`, { headers: headers })
    }

    getEdges(): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        })
        return this.http.get<any>(`${environment.baseUrl}${environment.getEdgeData}`, { headers: headers })
    }
}
