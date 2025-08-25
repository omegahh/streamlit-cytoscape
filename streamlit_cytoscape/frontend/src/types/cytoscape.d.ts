declare module "cytoscape-fcose" {
  import type { Extension } from "cytoscape"
  const fcose: Extension
  export default fcose
}

declare module "cytoscape-klay" {
  import type { Extension } from "cytoscape"
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

// Base element interface
export interface ElementData {
  readonly id: string
  readonly source?: string
  readonly target?: string
  [key: string]: unknown
}

export interface CytoscapeElement {
  readonly data: ElementData
  selected?: boolean
  selectable?: boolean
  [key: string]: unknown
}

// Style interface with better typing
export interface StyleProperties {
  readonly [property: string]: string | number | ((ele: any) => string | number)
}

export interface CytoscapeStylesheet {
  readonly selector: string
  readonly style: StyleProperties
}

// Layout type union with better constraints
export type BuiltInLayoutName =
  | "grid"
  | "circle"
  | "concentric"
  | "breadthfirst"
  | "cose"
  | "random"
  | "preset"

export interface BaseLayoutOptions {
  readonly animationDuration?: number
  readonly fit?: boolean
  readonly padding?: number
}

export interface BuiltInLayoutOptions extends BaseLayoutOptions {
  readonly name: BuiltInLayoutName
  [key: string]: unknown
}

export type CytoscapeLayout =
  | FcoseLayoutOptions
  | KlayLayoutOptions
  | BuiltInLayoutOptions

// Component selection with readonly arrays
export interface ComponentSelection {
  readonly nodes: readonly string[]
  readonly edges: readonly string[]
}

// Utility types
export type LayoutName =
  | FcoseLayoutOptions["name"]
  | KlayLayoutOptions["name"]
  | BuiltInLayoutName
export type SelectionType = "single" | "additive"

// Node and edge type guards
export const isNode = (element: CytoscapeElement): boolean =>
  !element.data.source
export const isEdge = (element: CytoscapeElement): boolean =>
  !!element.data.source
