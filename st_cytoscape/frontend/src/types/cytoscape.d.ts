declare module "cytoscape-fcose" {
  import { Extension } from "cytoscape"
  const fcose: Extension
  export default fcose
}

declare module "cytoscape-klay" {
  import { Extension } from "cytoscape"
  const klay: Extension
  export default klay
}

// Enhanced layout type definitions
export interface FcoseLayoutOptions {
  name: "fcose"
  quality?: "default" | "draft" | "proof"
  randomize?: boolean
  animate?: boolean
  animationDuration?: number
  animationEasing?: string
  fit?: boolean
  padding?: number
  nodeDimensionsIncludeLabels?: boolean
  uniformNodeDimensions?: boolean
  packComponents?: boolean
  nodeRepulsion?: number
  idealEdgeLength?: number
  edgeElasticity?: number
  nestingFactor?: number
  gravity?: number
  numIter?: number
  tile?: boolean
  tilingPaddingVertical?: number
  tilingPaddingHorizontal?: number
  gravityRangeCompound?: number
  gravityCompound?: number
  gravityRange?: number
  initialEnergyOnIncremental?: number
}

export interface KlayLayoutOptions {
  name: "klay"
  addUnnecessaryBendpoints?: boolean
  aspectRatio?: number
  borderSpacing?: number
  compactComponents?: boolean
  crossingMinimization?: "LAYER_SWEEP" | "INTERACTIVE"
  cycleBreaking?: "GREEDY" | "INTERACTIVE"
  direction?: "UNDEFINED" | "RIGHT" | "LEFT" | "DOWN" | "UP"
  edgeRouting?: "ORTHOGONAL" | "POLYLINE" | "SPLINES"
  edgeSpacingFactor?: number
  feedbackEdges?: boolean
  fixedAlignment?:
    | "NONE"
    | "LEFTUP"
    | "RIGHTDOWN"
    | "LEFTDOWN"
    | "RIGHTUP"
    | "BALANCED"
  inLayerSpacingFactor?: number
  layoutHierarchy?: boolean
  linearSegmentsDeflectionDampening?: number
  mergeEdges?: boolean
  mergeHierarchyCrossingEdges?: boolean
  nodeLayering?: "NETWORK_SIMPLEX" | "LONGEST_PATH" | "INTERACTIVE"
  nodePlacement?: "BRANDES_KOEPF" | "LINEAR_SEGMENTS" | "INTERACTIVE" | "SIMPLE"
  randomizationSeed?: number
  routeSelfLoopInside?: boolean
  separateConnectedComponents?: boolean
  spacing?: number
  thoroughness?: number
}

export interface CytoscapeElement {
  data: {
    id: string
    source?: string
    target?: string
    [key: string]: any
  }
  selected?: boolean
  selectable?: boolean
  [key: string]: any
}

export interface CytoscapeStylesheet {
  selector: string
  style: {
    [property: string]: any
  }
}

export type CytoscapeLayout =
  | FcoseLayoutOptions
  | KlayLayoutOptions
  | {
      name:
        | "grid"
        | "circle"
        | "concentric"
        | "breadthfirst"
        | "cose"
        | "random"
        | "preset"
      animationDuration?: number
      fit?: boolean
      padding?: number
      [key: string]: any
    }

export interface ComponentSelection {
  nodes: string[]
  edges: string[]
}

