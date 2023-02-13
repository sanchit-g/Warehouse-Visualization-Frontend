export interface NodeListResponse {
    nodes: NodeData[];
}
export interface NodeData {
    nodeIndex: number;
    data: Node;
}
export interface Node {
    id: string;
}