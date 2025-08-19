declare module 'cytoscape-fcose' {
  import { Extension } from 'cytoscape';
  const fcose: Extension;
  export default fcose;
}

declare module 'cytoscape-klay' {
  import { Extension } from 'cytoscape';
  const klay: Extension;
  export default klay;
}

export interface CytoscapeElement {
  data: {
    id: string;
    source?: string;
    target?: string;
    [key: string]: any;
  };
  selected?: boolean;
  selectable?: boolean;
  [key: string]: any;
}

export interface CytoscapeStylesheet {
  selector: string;
  style: {
    [property: string]: any;
  };
}

export interface CytoscapeLayout {
  name: string;
  animationDuration?: number;
  [key: string]: any;
}

export interface ComponentSelection {
  nodes: string[];
  edges: string[];
}