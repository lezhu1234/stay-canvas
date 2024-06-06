import * as PredefinedEventList from "./predefinedEvents"
import StayStage from "./stay/stayStage"
import { ContextLayerSetFunction, EventProps } from "./types"
import { Dict, ListenerProps, StayTools, UserStayCanvasProps } from "./userTypes"

export class UserStayCanvas {
  container: HTMLDivElement
  layers: number | ContextLayerSetFunction[]
  width: number
  height: number
  eventList: EventProps[]
  listenerList: ListenerProps[]
  id: string | HTMLDivElement
  #stay: StayStage
  mounted: ((tools: StayTools) => void) | undefined
  constructor({
    id,
    width = 500,
    height = 500,
    layers = 2,
    eventList = [],
    listenerList = [],
    mounted,
  }: UserStayCanvasProps) {
    this.id = id
    this.layers = layers
    this.width = width
    this.height = height
    this.eventList = eventList
    this.listenerList = listenerList
    this.mounted = mounted
    this.container = this.#initContainer()
    const { canvasLayers, contextLayerSetFunctionList } = this.#initLayers()
    this.#stay = new StayStage(canvasLayers, contextLayerSetFunctionList, this.width, this.height)
    this.setEventList(this.eventList)
    this.setListenerList(this.listenerList)
    if (this.mounted) {
      this.mounted(this.#stay.tools)
    }
  }

  init() {}

  setEventList(eventList: EventProps[]) {
    this.#stay.clearEvents()
    ;[...Object.values(PredefinedEventList), ...eventList].forEach((event) => {
      this.#stay.registerEvent(event)
    })
  }

  setListenerList(listenerList: ListenerProps[]) {
    this.#stay.clearEventListeners()
    listenerList.forEach((listener) => {
      this.#stay.addEventListener(listener)
    })
  }
  #initContainer() {
    if (typeof this.id === "string") {
      this.container = document.getElementById(this.id) as HTMLDivElement
    } else {
      this.container = this.id
    }

    if (this.container.tagName !== "DIV") {
      throw new Error("stay canvas container should be a div")
    }
    return this.container
  }

  trigger(name: string, payload?: Dict) {
    const customEvent = new Event(name)
    if (this.#stay) {
      this.#stay.triggerAction(customEvent, { [name]: customEvent }, payload || {})
    }
  }

  #initLayers() {
    let contextLayerSetFunctionList: ContextLayerSetFunction[] = []

    if (typeof this.layers === "number") {
      Array(this.layers)
        .fill(0)
        .forEach(() => {
          contextLayerSetFunctionList.push((canvas: HTMLCanvasElement) => {
            return canvas.getContext("2d")
          })
        })
    } else {
      contextLayerSetFunctionList = this.layers
    }

    if (contextLayerSetFunctionList.length < 1) {
      throw new Error("layers must be greater than 0")
    }

    const canvasLayers: HTMLCanvasElement[] = []

    contextLayerSetFunctionList.forEach(() => {
      const canvas = document.createElement("canvas")
      canvas.width = this.width
      canvas.height = this.height
      canvas.style.position = "absolute"
      canvas.style.top = "0"
      canvas.style.left = "0"
      canvas.tabIndex = 1
      this.container.appendChild(canvas)
      canvasLayers.push(canvas)
    })

    return { canvasLayers, contextLayerSetFunctionList }
  }
}
