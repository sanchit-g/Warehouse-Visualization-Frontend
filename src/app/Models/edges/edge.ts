export interface EdgeList {
    edges: EdgeData[];
}
export interface EdgeData {
    edgeIndex: number;
    data: Edge;
}
export interface Edge {
    id: String;
    source: String;
    target: String;
}