# stay-canvas

stay-canvas

<div align="center"><a href="./README.en.md">
  <strong>English</strong>
</a> | <a href="./README.zh.md">
  <strong>中文简体</strong>
</a></div>

 ## Translated by [ChatGPT4](https://chatgpt.com/)
 
## Table of Contents

- [Introduction](#introduction)
- [Main Features](#main-features)
- [Installation](#installation)
- [Getting Started Example](#getting-started-example)
- [More Examples](#more-examples)
- [Core Concepts](#core-concepts)
  - [Shape](#shape)
  - [Listener](#listener)
  - [Event](#event)
- [API Documentation](#api-documentation)
  - [StayCanvas Class](#staycanvas-class)
  - [Shape API](#shape-api)
    - [Image: Image](#image-image)
    - [Point: Point](#point-point)
    - [Line: Line](#line-line)
    - [Rectangle: Rectangle](#rectangle-rectangle)
    - [Circle: Circle](#circle-circle)
    - [Text: Text](#text-text)
    - [Path: Path](#path-path)
    - [Custom Shape](#custom-shape)
    - [Shape State](#shape-state)
    - [Animation](#animation)
  - [Listener API](#listener-api)
    - [Selector](#selector)
    - [State](#state)
    - [Simple Logic Operations](#simple-logic-operations)
    - [Event](#event-1)
    - [Listener Callback Function](#listener-callback-function)
    - [StayTools Utility Functions](#staytools-utility-functions)
      - [createChild](#createchild)
      - [updateChild](#updatechild)
      - [removeChild](#removechild)
      - [getContainPointChildren](#getcontainpointchildren)
      - [hasChild](#hasChild)
      - [fix](#fix)
      - [switchState](#switchstate)
      - [getChildrenBySelector](#getchildrenbyselector)
      - [getAvailiableStates](#getavailiablestates)
      - [changeCursor](#changecursor)
      - [moveStart](#movestart)
      - [move](#move)
      - [zoom](#zoom)
      - [log](#log)
      - [redo](#redo)
      - [undo](#undo)
      - [triggerAction](#triggeraction)
      - [deleteListener](#deletelistener)
  - [Event API](#event-api)
    - [name](#name)
    - [trigger](#trigger)
    - [conditionCallback](#conditioncallback)
    - [successCallback](#successcallback)
  - [trigger Function API](#trigger-function-api)
  - [setListenerList Function API](#setlistenerlist-function-api)
  - [setEventList Function API](#seteventlist-function-api)

## Introduction

`stay-canvas` provides a set of easy-to-use APIs to help developers integrate canvas functionality into their projects. Whether it's drag-and-drop operations, shape drawing, or complex event handling, this component can meet your needs.

## Main Features

- **Quick Start**: Developers can quickly get started and easily implement various graphics and interaction effects.
- **Flexible and Powerful Configurability**: Supports custom events, custom listeners, and custom drawing components, allowing developers to highly customize according to specific needs.
- **Rich Graphics Support**: Supports various basic shapes such as rectangles, circles, paths, images, etc.
- **Easy Integration**: Simple API design enables quick integration into existing projects.
- **Zero Dependency**: No third-party dependencies.

`stay-canvas` allows you to easily achieve various graphics and interaction effects in your project without deeply understanding the complex Canvas API.

## Installation

```bash
npm install stay-canvas
```

## Getting Started Example

`index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>StayCanvas Demo</title>
</head>
<body>
  <div id="demo"></div>
  <script type="module" src="/src/examples/demo/main.ts"></script>
</body>
</html>
```

`main.ts`
```typescript
import { ListenerProps, Rectangle, StayCanvas } from "stay-canvas"

const DragListener: ListenerProps = {
  name: "dragListener",
  event: ["dragstart", "drag"],
  callback: ({ e, composeStore, tools: { appendChild, updateChild } }) => {
    return {
      dragstart: () => ({
        dragStartPosition: e.point,
        dragChild: appendChild({
          shape: new Rectangle({
            x: e.x,
            y: e.y,
            width: 0,
            height: 0,
            props: { color: "red" },
          }),
          className: "annotation",
        }),
      }),
      drag: () => {
        const { dragStartPosition, dragChild } = composeStore
        const x = Math.min(dragStartPosition.x, e.x)
        const y = Math.min(dragStartPosition.y, e.y)
        const width = Math.abs(dragStartPosition.x - e.x)
        const height = Math.abs(dragStartPosition.y - e.y)
        updateChild({
          child: dragChild,
          shape: dragChild.shape.update({ x, y, width, height }),
        })
      },
    }
  },
}

new StayCanvas({
  id: "demo",
  width: 500,
  height: 500,
  listenerList: [DragListener],
})
``` 

<video src="videos/demo.mp4" controls="">
</video>

## More Examples
https://github.com/lezhu1234/demo-stay-canvas

## Core Concepts

### Shape

In stay-canvas, all elements on the canvas are `StayChild` objects, which are returned when using the `createChild`, `appendChild`, `updateChild` functions. Shape is a crucial attribute when creating or updating `StayChild` objects, accepting an object from the Shape subclass defining all drawing behaviors on the canvas. The current built-in Shapes in stay-canvas include:

- Shape: Base class which `Shape` in `StayChild` objects should inherit. The constructor is defined as follows:

  ```typescript
  constructor({ color, lineWidth, type, gco, state = "default", stateDrawFuncMap = {} }: ShapeProps)

  export interface ShapeProps {
    color?: string | CanvasGradient // The color of the drawing object, passed to strokeStyle/fillStyle
    lineWidth?: number // The line width of the drawing object, passed to lineWidth
    type?: valueof<typeof SHAPE_DRAW_TYPES> // "fill" | "stroke", the drawing type of the object
    gco?: GlobalCompositeOperation // The global composite operation of the drawing object, passed to globalCompositeOperation
    state?: string // The state of the drawing object, used with stateDrawFuncMap to achieve different drawing effects in different states
    stateDrawFuncMap?: Dict<(props: ShapeDrawProps) => void> // The state drawing function map of the drawing object
  }
  ```

### Listener

In stay-canvas, you can register listeners through the listenerList property. This property is an array where each element is a listener object that must conform to the ListenerProps type constraint. See [Listener API](#listener-api) for details.

### Event

In stay-canvas, you can register events through eventList. This event list is an array where each element is an event object that must conform to the EventProps type constraint. See [Event API](#event-api) for details.

## API Documentation

### StayCanvas Class

```typescript
export declare interface UserStayCanvasProps {
    id: string | HTMLDivElement;
    width: number;
    height: number;
    layers?: number | ContextLayerSetFunction[];
    eventList?: EventProps[];
    listenerList?: ListenerProps[];
    mounted?: (tools: StayTools) => void;
}


export declare class StayCanvas {
    constructor({ id, width, height, layers, eventList, listenerList, mounted, }: UserStayCanvasProps);
    setEventList(eventList: EventProps[]): void;
    setListenerList(listenerList: ListenerProps[]): void;
    trigger(name: string, payload?: Dict): void;
}

// example
const stay = new StayCanvas({
  id: "example-id",
  width,
  height,
  mounted: initFunc,
})

const stay = new StayCanvas({
  id: document.getElementById("example-id"),
  width: 500,
  height: 500,
  mounted: initFunc,
  listenerList: listenerList,
})
```

### Shape API

#### In stay-canvas, some simple Shapes are built-in, and you can easily create custom Shapes by inheriting the Shape class.

- Image: Image

  - This object draws an image on the canvas. Its constructor is defined as follows:

  ```typescript
  // x, y, width,  height correspond to dx, dy, dWidth, dHeight in the documentation
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  export interface ImageProps {
    src: string // The src of the image
    x: number // The x-coordinate of the top-left corner of the image on the canvas, relative to screen pixels
    y: number // The y-coordinate of the top-left corner of the image on the canvas, relative to screen pixels
    width: number // The width of the image, relative to screen pixels
    height: number  // The height of the image, relative to screen pixels
    sx?: number  // The x-coordinate of the starting point on the image, relative to the original pixels of the image
    sy?: number  // The y-coordinate of the starting point on the image, relative to the original pixels of the image
    swidth?: number // The width of the image, relative to the original pixels of the image
    sheight?: number // The height of the image, relative to the original pixels of the image
    imageLoaded?: (image: StayImage) => void // Callback after the image is loaded
    props?: ShapeProps // This object inherits from Shape
  }
  constructor(imageProps: ImageProps)
  ```

  - The following methods of this object may be useful in some cases:

  ```typescript
  // This method is used to update the properties of the point
  declare update({
    src,
    x,
    y,
    width,
    sx,
    sy,
    swidth,
    sheight,
    height,
    props,
  }: Partial<ImageProps>): this
  ```

- Point: Point

  - This object draws a point on the canvas. Its constructor is defined as follows:

  ```typescript
  // x:number The x-coordinate of the point
  // y:number The y-coordinate of the point
  // props will be passed to the constructor of Shape
  constructor(x: number, y: number, props: ShapeProps = {})
  ```

  - The following methods of this object may be useful in some cases:

  ```typescript
  // This method is used to update the properties of the point
  declare update({ x, y, props }: PointProps): this

  // This method can calculate the distance between two points
  declare distance(point: Point): number

  // This method can determine if two points are within a certain distance. It actually calls the distance method and compares it with the offset
  declare near(point: Point, offset: number = 10): boolean

  // This method can determine if the minimum distance between a point and a line segment is within a specified distance
  // When the projection of the line between the point and a line segment endpoint on the line segment is on the line segment, the minimum distance is the vertical distance from the point to the straight line; otherwise, it is the smaller distance between the point and the two endpoints of the line segment
  // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
  declare nearLine(line: Line, offset: number = 10): boolean
  ```

- Line: Line

  - This object draws a line segment on the canvas. Its constructor is defined as follows:

  ```typescript
  // x1:number The x-coordinate of the starting point of the line segment
  // y1:number The y-coordinate of the starting point of the line segment
  // x2:number The x-coordinate of the end point of the line segment
  // y2:number The y-coordinate of the end point of the line segment
  // props will be passed to the constructor of Shape
  constructor({ x1, y1, x2, y2, props }: LineProps)
  ```

  - The following methods of this object may be useful in some cases:

  ```typescript
  // This method is used to update the properties of the line segment
  declare update({ x1, y1, x2, y2, props }: UpdateLineProps): this

  // This method is used to calculate the vertical distance from the point to the straight line
  declare distanceToPoint(point: Point): number

  // This method is used to calculate the length of the line segment
  declare len(): number

  // The calculation method is the same as the nearLine method of the Point object
  declare segmentDistanceToPoint(point: Point): number

  // This method can determine if the minimum distance between a point and a line segment is within a specified distance by calling the segmentDistanceToPoint method
  declare nearPoint(point: Point, offset: number = 10): boolean
  ```

- Rectangle: Rectangle

  - This object draws a rectangle on the canvas. Its constructor is defined as follows:

  ```typescript
  // x:number The x-coordinate of the top-left corner of the rectangle
  // y:number The y-coordinate of the top-left corner of the rectangle
  // width:number The width of the rectangle
  // height:number The height of the rectangle
  // props will be passed to the constructor of Shape
  constructor({ x, y, width, height, props = {} }: RectangleAttr)
  ```

  - After creation, this object will have the following properties:

  ```typescript
  // leftTop: Point The coordinates of the top-left corner of the rectangle
  // rightTop: Point The coordinates of the top-right corner of the rectangle
  // leftBottom: Point The coordinates of the bottom-left corner of the rectangle
  // rightBottom: Point The coordinates of the bottom-right corner of the rectangle
  // leftBorder: Line The left border line of the rectangle
  // rightBorder: Line The right border line of the rectangle
  // topBorder: Line The top border line of the rectangle
  // bottomBorder: Line The bottom border line of the rectangle
  // area: number The area of the rectangle
  ```

- The following methods of this object may be useful in some cases:

  ```typescript
  // This method is used to update the properties of the object
  declare update(Partial<RectangleAttr>): this

  // This method is used to conveniently calculate the scale ratio and offset required to scale another rectangle proportionally and center it within the current rectangle
  // When calling this method, you need to pass in the width and height values, and it will return a new Rectangle object and three properties
  type FitInfoAttr = {
    rectangle: Rectangle
    scaleRatio: number
    offsetX: number
    offsetY: number
  }
  declare computeFitInfo(width: number, height: number): FitInfoAttr

  // example:
  // Create a rectangle with a width and height of 200*300, and then calculate the scale ratio and offset required to proportionally scale and center this rectangle in a container rectangle with a width and height of 600*600
  // rectangle is the new rectangle created after scaling and centering proportionally, scaleRatio is the scaling ratio, and offsetX and offsetY are the offsets
  const containerRect = new Rectangle({ x: 0, y: 0, width: 600, height: 600 })
  const { rectangle, scaleRatio, offsetX, offsetY } = containerRect.computeFitInfo(200, 300)

  // This method is used to determine if a point is inside the rectangle
  declare (point: Point): boolean

  // This method is used to copy a rectangle. The copied rectangle will have the same properties as the current rectangle but will not share the same object
  declare copy(): Rectangle

  // These two methods are used to convert the rectangle coordinates from the world coordinate system to the screen coordinate system, and vice versa
  declare worldToScreen(offsetX: number, offsetY: number, scaleRatio: number): Rectangle
  declare screenToWorld(offsetX: number, offsetY: number, scaleRatio: number): { x: number, y: number, width: number, height: number }
  ```

- Circle: Circle

  - This object draws a circle on the canvas. Its constructor is defined as follows:

  ```typescript
  export interface CircleAttr {
    x: number // The x-coordinate of the center of the circle
    y: number // The y-coordinate of the center of the circle
    radius: number // The radius of the circle
    props?: ShapeProps
  }
  declare constructor({ x, y, radius, props }: CircleAttr)
  ```

  - The following methods of this object may be useful in some cases:

  ```typescript
  // This method is used to update the properties of the circle
  declare update({ x, y, radius, props }: Partial<CircleAttr>): this

  // This method can determine if a point is inside the circle
  declare (point: Point): boolean
  ```

- Text: Text

  - This object draws text on the canvas. Its constructor is defined as follows:

  ```typescript
  // x:number The x-coordinate of the text, the coordinate is the center point x coordinate of the rectangle containing the text
  // y:number The y-coordinate of the text, the coordinate is the center point y coordinate of the rectangle containing the text
  // font:string The font of the text https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
  constructor({ x, y, text, font, props }: TextAttr)
  ```

  - The following methods of this object may be useful in some cases:

  ```typescript
  // This method is used to update the properties of the text
  declare update({
    x,
    y,
    font,
    text,
    props,
  }: Partial<TextAttr>)

  // This method can determine if a point is inside the rectangle containing the text
  declare (point: Point): boolean
  ```

- Path: Path

- This object draws a path on the canvas. Its constructor is defined as follows:

  ```typescript
  // points: Point[] The points on the path
  // radius: number The radius of the path
  constructor({ points, radius, props }: PathAttr)
  ```

#### Custom Shape

- Custom Shape

  - We will take Rectangle as an example to detail how to customize a Shape (note, this is not the complete Rectangle code, just extract the necessary parts to introduce the custom Shape process)

  ```typescript
  // The class you define must inherit from Shape and implement the following abstract methods:

  // abstract contains(point: SimplePoint, cxt?: CanvasRenderingContext2D): boolean
  // abstract copy(): Shape
  // abstract draw(ctx: CanvasRenderingContext2D, canvas?: HTMLCanvasElement): void
  // abstract move(offsetX: number, offsetY: number): void
  // abstract update(props: any): Shape
  // abstract zoom(zoomScale: number): void
  export class Rectangle extends Shape {
    constructor({ x, y, width, height, props = {} }: RectangleAttr) {
      // You can pass props to Shape here, the properties in props have been introduced in the previous module,
      super(props)
      this.x = x
      this.y = y
      this.width = width
      this.height = height
      ...
    }

    ...

    // This function determines whether a point is in your custom Shape. When we define a listener, this function will be called to determine whether the object meets the area conditions triggered by the current selector. The parameter of this function is the coordinates of the mouse position.
    contains(point: Point): boolean {
      return (
        point.x > this.x &&
        point.x < this.x + this.width &&
        point.y > this.y &&
        point.y < this.y + this.height
      )
    }

    // This function copies the current object. The result returned needs to be a new object. In it, you can call the _copy() method of Shape to copy the props
    copy(): Rectangle {
      return new Rectangle({
        ...this,
        props: this._copy(),
      })
    }

    // Core drawing function, this function draws your Shape. The parameter of this function is the ShapeDrawProps object. You can call the context method to draw your Shape

    //export interface ShapeDrawProps {
    //  context: CanvasRenderingContext2D
    //  canvas: HTMLCanvasElement
    //  now: number // The current timestamp, this value can be used to achieve animation effects
    //}
    draw({ context }: ShapeDrawProps) {
      context.lineWidth = this.lineWidth

      if (this.type === SHAPE_DRAW_TYPES.STROKE) {
        context.strokeStyle = this.color
        context.strokeRect(this.x, this.y, this.width, this.height)
      } else if (this.type === SHAPE_DRAW_TYPES.FILL) {
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.width, this.height)
      }
    }

    // When your application needs to move elements on the canvas, this function will be called. If your application does not need this function, you can leave this method empty
    // This function will be called when moving the entire canvas. You can update the position of your Shape here. The parameter of this function is the offset of the movement
    move(offsetX: number, offsetY: number) {
      this.update({
        x: this.x + offsetX,
        y: this.y + offsetY,
      })
    }

    // Update function, used to update the properties of Shape
    update({
      x = this.x,
      y = this.y,
      width = this.width,
      height = this.height,
      props,
    }: Partial<RectangleAttr>) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
      this._update(props || {})
      this.init()

      return this
    }

    // When your application needs to scale elements on the canvas, this function will be called. If your application does not need this function, you can leave this method empty
    // This function will be called when scaling the entire canvas. You can update the position of your Shape here. The parameter of this function is the scaling ratio. You can use the getZoomPoint method of Shape to calculate the position of a coordinate after scaling
    // In this example, Rectangle calls the getZoomPoint method and passes the zoomScale and coordinates of the top-left corner as parameters to get the scaled top-left coordinate
    // For width and height, just multiply the original width and height by zoomScale
    zoom(zoomScale: number) {
      const leftTop = this.getZoomPoint(zoomScale, this.leftTop)
      this.update({
        x: leftTop.x,
        y: leftTop.y,
        width: this.width * zoomScale,
        height: this.height * zoomScale,
      })
    }
  }
  ```

##### Shape State

  - Unlike the state of stay-canvas, Shape itself also has a state field. When your Shape requires different drawing effects in different states, you can use the state field to control it. For example, we need to implement a Rectangle that, by default, is in the default state, and draws an empty rectangle. When the user moves the mouse over the Rectangle, we change the state of the Rectangle to hover and set the color of the Rectangle to red during drawing. When the user moves the mouse out of the Rectangle, we change the state of the Rectangle to default and restore its color.

  ```typescript
  // Define a custom Rectangle, using the custom stateDrawFuncMap to control the drawing effects in different states
  export class CustomRectangle extends Rectangle {
    constructor({ x, y, width, height, props = {} }: RectangleAttr) {
      super({ x, y, width, height, props })
      this.initStateDrawFuncMap()
    }

    initStateDrawFuncMap() {
      this.stateDrawFuncMap = {
        default: ({ context }) => {
          this.setColor(context, "white")
          context.strokeRect(this.x, this.y, this.width, this.height)
        },
        hover: ({ context }) => {
          this.setColor(context, "red")
          context.strokeRect(this.x, this.y, this.width, this.height)
        },
      }
    }
  }

  // Create a hover listener. When the mouse moves over the Rectangle, we change its state to hover. When the mouse moves out of the Rectangle, we change its state to default.
  export const HoverListener: ListenerProps = {
    name: "hoverListener",
    event: "mousemove",
    callback: ({ e, tools: { getChildrenBySelector } }) => {
      const labels = getChildrenBySelector(".label")
      labels.forEach((label) => {
        let rectState = label.shape.contains(e.point) ? "hover" : "default"
        label.shape.switchState(rectState)
      })
    },
  }
  ```
  <video src="videos/state-map.mp4" controls="">
  </video>

##### Animation

  When creating a custom Shape, you need to implement the draw method. In this method, there is a now timestamp parameter, which can be used to create animation effects.
  In the previous example, when hovering over the CustomRectangle, we want the rectangle to have a border breathing effect that changes from white to red and then back to white within 2 seconds instead of directly changing to red. We can modify the drawing function in the stateDrawFuncMap of hover as follows:

  ```typescript
  ...
  hover: ({ context, now }) => {
    const c = Math.abs(
      Math.ceil((now % 1000) / 4) - 255 * (Math.floor((now % 10000) / 1000) % 2)
    )
    this.setColor(context, `rgb(255, ${c}, ${c})`)
    context.strokeRect(this.x, this.y, this.width, this.height)
  },
  ...
  ```

  <video src="videos/shape-anim.mp4" controls="">
  </video>
  
  You can combine animation libraries such as [gsap](https://gsap.com/) and [tween](https://github.com/tweenjs/tween.js) to achieve more rich animation effects.


### Listener API

```typescript
declare const DEFAULTSTATE = "default-state"

interface ListenerProps {
  name: string // Listener name. You can use any string as the name, but it must be unique.
  state?: string // Listener state. We will introduce it later. The default value is DEFAULTSTATE.
  selector?: string // Listener selector. We will introduce it later.
  event: string | string[] // Listener event. When the event is triggered, the callback function of the listener will be executed. When the event is an array, any event triggers will execute the callback function of the listener, and the event name will be returned in e.name in the callback function.
  sortBy?: SortChildrenMethodsValues | ChildSortFunction // The method to sort the selected elements after the selector selects the elements. We will introduce it later. The default value is SORT_CHILDREN_METHODS.AREA_ASC, which is sorted by area in ascending order. You can also customize the sorting function.
  callback: (p: ActionCallbackProps) => {
    [key: string]: any
  } | void
}

// Custom element sorting method
export type ChildSortFunction = (a: StayChild, b: StayChild) => number
```

#### Selector

stay-canvas implements a very simple selector function, mainly used to filter elements by name and id. When we use appendChild, updateChild, etc., we need to provide a `className` attribute, and the objects returned by these utility functions will contain an `id` attribute. When defining the selector, you can select the corresponding elements by adding a `.` symbol before the `className` attribute and a `#` symbol before the `id` attribute.

```typescript
const child1 = appendChild({
  className: "label",
  ...
})
const child2 = appendChild({
  className: "label",
  ...
})

getChildrenBySelector(".label") // returns [child1, child2]
getChildrenBySelector("#" + child1.id) // returns child1
getChildrenBySelector("!.label") // returns []
```

#### State

In stay-canvas, you can control the current state through the state attribute. This attribute is a string, and the default state is DEFAULTSTATE = "default-state". The concept of state comes from finite state machines. By setting the state, you can flexibly control when the listener should be triggered. Imagine we want to achieve the following functionality:

- By default, dragging on the canvas will draw a rectangle based on the mouse position.
- When we select this rectangle, dragging on it will move the rectangle.

We can set up three listeners to achieve this functionality:

- The first listener has the state attribute set to DEFAULTSTATE and listens for drag events. In the callback function, we implement the drawing functionality of the shape.
- The second listener has the state attribute set to DEFAULTSTATE and listens for click events. In the callback function, if we detect that the user has clicked on the drawn element, we change the current state to "selected". Otherwise, we change the state back to DEFAULTSTATE.
- The third listener has the state attribute set to "selected" and listens for drag events. In the callback function, we implement the functionality to move the selected rectangle.

You can perform some simple logic operations on the state field.

#### Simple Logic Operations

You can use some very simple logic operations on certain attributes. Currently supported attributes include state and selector.

```typescript
export const SUPPORT_LOGIC_OPRATOR = {
  AND: "&",
  OR: "|",
  NOT: "!",
}

const selector = ".A&#B" // Select elements with class name A and id B
const selector = ".A&!#B" // Select elements with class name A and id not B
const selector = "!.A" // Select elements with class name not A

const state = "!selected" // When the state is not selected
const state = "default-state|selected" // When the state is default-state or selected
```

#### Event

The event attribute accepts a string. You can pass an event array to StayCanvas's eventList to customize or overwrite predefined events. Events with the same name will be overwritten. How to customize events will be introduced later.

In stay-canvas, the following events are predefined:

- mousedown: Mouse down
- mousemove: Mouse move
- mouseup: Mouse up
- keydown: Key down
- keyup: Key up
- zoomin: Mouse wheel up
- zoomout: Mouse wheel down
- dragstart: Mouse left button down
- drag: Mouse left button down and move, and the mouse moves more than 10 pixels from the initial position
- dragend: Dragging ends
- startmove: Ctrl key down and mouse left button down
- move: Ctrl key down and mouse left button down and move
- click: Click
- redo: Ctrl + Shift + Z
- undo: Ctrl + Z

#### Listener Callback Function

The callback function is the core function used to control user interactions on the canvas. This function is defined as follows:

```typescript
// The parameter of this function is of type ActionCallbackProps. You can return a CallbackFuncMap object or nothing.
export type UserCallback = (p: ActionCallbackProps) => CallbackFuncMap<typeof p> | void

export type CallbackFuncMap<T extends ActionCallbackProps> = {
  [key in T["e"]["name"]]: () => { [key: string]: any } | void | undefined
}

// ActionCallbackProps is defined as follows:
export interface ActionCallbackProps {
  originEvent: Event // The original event, this parameter is the event parameter passed when addEventListener is called
  e: ActionEvent // The event object defined in stay-canvas. See the ActionEvent type for details.
  store: storeType // A global storage object of type Map
  stateStore: storeType // A storage object of type Map. The difference from store is that this object will be cleared when the state changes.
  composeStore: Record<string, any> // When we define the listener, if the event parameter we pass is an array, the composeStore will be the same object for each event triggered.
  tools: StayTools // StayTools object, which contains some utility functions. See StayTools for details.
  payload: Dict // The parameters passed when we manually call the trigger function
}

export interface ActionEvent {
  state: string // The state when the event is triggered
  name: string // The name of the event
  x: number // The x-coordinate of the mouse relative to the canvas
  y: number // The y-coordinate of the mouse relative to the canvas
  point: Point // The coordinates of the mouse relative to the canvas
  target: StayChild // The element that triggered the event
  pressedKeys: Set<string> // The currently pressed keyboard and mouse keys. The left mouse button is mouse0, the right mouse button is mouse1, and the mouse wheel is mouse2.
  key: string | null // The keyboard key that triggered the event. When we trigger the mouseup event, the key will not be in pressedKeys, but it will be in key.
  isMouseEvent: boolean // Whether it is a mouse event
  deltaX: number // The x-axis offset when the mouse wheel slides
  deltaY: number // The y-axis offset when the mouse wheel slides
  deltaZ: number // The z-axis offset when the mouse wheel slides
}


// example 1
// In this example, the callback function does not return any value. This listener implements the function of switching the state of the rectangle based on whether the mouse is inside the rectangle when the mouse moves.
export const HoverListener: ListenerProps = {
  name: "hoverListener",
  event: "mousemove",
  callback: ({ e, tools: { getChildrenBySelector } }) => {
    const labels = getChildrenBySelector(".label")
    labels.forEach((label) => {
      let rectState = label.shape.contains(e.point) ? "hover" : "default"
      label.shape.switchState(rectState)
    })
  },
}


// example 2
// In this example, the callback function returns a CallbackFuncMap object. Notice that the event of this listener is an array, corresponding to the three keys returned by the callback function. Each key corresponds to a function, which will be executed when the dragstart, drag, and dragend events are triggered. The value returned by each function will be merged into the composeStore.

// In the dragstart listener, we record the dragStartPosition and dragChild and return them so that in the drag listener, we can get the dragStartPosition and dragChild through the composeStore to implement the dragging functionality.

// In the dragend listener, we call the log function, which will take a snapshot of the current stay-canvas, and later we can perform undo/redo functions to revert/recover functionality.

const DragListener: ListenerProps = {
  name: "dragListener",
  event: ["dragstart", "drag", "dragend"],
  callback: ({ e, composeStore, tools: { appendChild, updateChild, log } }) => {
    return {
      dragstart: () => ({
        dragStartPosition: new Point(e.x, e.y),
        dragChild: appendChild({
          shape: new CustomRectangle({
            x: e.x,
            y: e.y,
            width: 0,
            height: 0,
            props: { color: "white" },
          }),
          className: "label",
        }),
      }),
      drag: () => {
        const { dragStartPosition, dragChild } = composeStore
        const x = Math.min(dragStartPosition.x, e.x)
        const y = Math.min(dragStartPosition.y, e.y)
        const width = Math.abs(dragStartPosition.x - e.x)
        const height = Math.abs(dragStartPosition.y - e.y)
        updateChild({
          child: dragChild,
          shape: dragChild.shape.update({ x, y, width, height }),
        })
      },
      dragend: () => {
        log()
      },
    }
  },
}
```

#### StayTools Utility Functions

StayTools object contains some utility functions, defined as follows:

```typescript
export interface StayTools {
  createChild: <T extends Shape>(props: createChildProps<T>) => StayChild<T>
  appendChild: <T extends Shape>(props: createChildProps<T>) => StayChild<T>
  updateChild: (props: updateChildProps) => StayChild
  removeChild: (childId: string) => void
  getContainPointChildren: (props: getContainPointChildrenProps) => StayChild[]
  hasChild: (id: string) => boolean
  fix: () => void
  switchState: (state: string) => void
  getChildrenBySelector: (
    selector: string,
    sortBy?: SortChildrenMethodsValues | ChildSortFunction
  ) => StayChild[]
  getAvailiableStates: (selector: string) => string[]
  changeCursor: (cursor: string) => void
  moveStart: () => void
  move: (offsetX: number, offsetY: number) => void
  zoom: (deltaY: number, center: SimplePoint) => void
  log: () => void
  redo: () => void
  undo: () => void
  triggerAction: (originEvent: Event, triggerEvents: Record<string, any>, payload: Dict) => void
  deleteListener: (name: string) => void
}
```

##### Element Creation and Update

- [`createChild`](#createchild) - Create a new element
- [`appendChild`](#appendchild) - Create a new element and add it to the canvas
- [`updateChild`](#updatechild) - Update the properties of an existing element
- [`removeChild`](#removechild) - Remove an element from the canvas

##### Element Query and Judgment

- [`getContainPointChildren`](#getcontainpointchildren) - Get all elements containing a point
- [`hasChild`](#haschild) - Determine if an element exists on the canvas
- [`getChildrenBySelector`](#getchildrenbyselector) - Get elements by selector
- [`getAvailableStates`](#getavailablestates) - Get all available states

##### State and View Control

- [`fix`](#fix) - Adjust all elements to the bottom layer
- [`switchState`](#switchstate) - Switch the current state
- [`changeCursor`](#changecursor) - Change the mouse cursor style
- [`moveStart`](#movestart) - Start moving all elements
- [`move`](#move) - Move all elements
- [`zoom`](#zoom) - Zoom all elements

##### Snapshot Control

- [`log`](#log) - Save the current canvas snapshot
- [`redo`](#redo) - Move forward to the next snapshot
- [`undo`](#undo) - Move backward to the previous snapshot

##### Event Triggering

- [`triggerAction`](#triggeraction) - Manually trigger an event
- [`deleteListener`](#deletelistener) - Delete a listener

##### createChild

The createChild function is used to create an element. This function accepts an object as a parameter, and the parameter is defined as follows:

```typescript
createChild: <T extends Shape>(props: createChildProps<T>) => StayChild<T>

export interface createChildProps<T> {
  id?: string // The id of the element. If not specified, it will be generated automatically.
  zIndex?: number // The zIndex of the element. This value will affect the drawing order of the element on the canvas. The smaller the zIndex value, the more forward the drawing. The default value is 1.
  shape: T // The shape of the element. This value must be an object that inherits from Shape. stay-canvas has built-in some subclasses of Shape, and you can also customize your own Shape subclasses. See below for details.
  className: string // The className of the element.
  layer?: number // The layer of the element. This value is the index of the element's canvas layer. 0 means the bottom layer, the larger the value, the closer to the top layer. You can also use negative numbers to represent layers. -1 means the top layer, -2 means the next layer of the top layer, and so on. The default value is -1.
}

// example:
createChild({
  shape: new Rectangle({
    x: e.x,
    y: e.y,
    width: 0,
    height: 0,
    props: { color: "white" },
  }),
  className: "annotation",
})
```

##### appendChild

The appendChild function is used to create an element and directly add it to the canvas. This function accepts an object as a parameter, and the parameter definition is the same as the createChild function.

```typescript
// example
appendChild({
  shape: new Rectangle({
    x: e.x,
    y: e.y,
    width: 0,
    height: 0,
    props: { color: "white" },
  }),
  className: "annotation",
})
```

##### updateChild

The updateChild function is used to update an element. This function accepts an object as a parameter. The parameters it accepts are different from the createChild function in that it needs a child object. This object can be obtained through the appendChild function or the createChild function return value. In addition, other parameters are optional. The parameter definition is as follows:

```typescript
export type updateChildProps<T = Shape> = {
  child: StayChild
} & Partial<createChildProps<T>>

// example
updateChild({
  child,
  shape: child.shape.update({
    x,
    y,
    width,
    height,
  }),
})
```

##### removeChild

The removeChild function is used to delete an element. This function accepts a string parameter childId, which is the id of the element, and has no return value.

```typescript
// example
removeChild(image.id)
```

##### getContainPointChildren

The getContainPointChildren function is used to get all elements containing a point. When using this function, you need to specify the selector to define the search range. The parameter definition is as follows:

```typescript
export interface getContainPointChildrenProps {
  selector: string | string[] // The selector, which can be a string or an array of strings. When it is an array of strings, it will return the union of all selector search results.
  point: SimplePoint // The coordinates of the mouse relative to the canvas || interface SimplePoint { x: number y: number }
  returnFirst?: boolean | undefined // Whether to return only the first element. The default value is false.
  sortBy?: SortChildrenMethodsValues | ChildSortFunction // The sorting method. The default value is SORT_CHILDREN_METHODS.AREA_ASC. You can also pass a function to customize the element sorting method.
}

// The built-in sorting methods are as follows:
export type SortChildrenMethodsValues = valueof<typeof SORT_CHILDREN_METHODS>
export const SORT_CHILDREN_METHODS = {
  X_ASC: "x-asc", // Sort by x-axis in ascending order
  X_DESC: "x-desc", // Sort by x-axis in descending order
  Y_ASC: "y-asc", // Sort by y-axis in ascending order
  Y_DESC: "y-desc", // Sort by y-axis in descending order
  WIDTH_ASC: "width-asc", // Sort by width in ascending order
  WIDTH_DESC: "width-desc", // Sort by width in descending order
  HEIGHT_ASC: "height-asc", // Sort by height in ascending order
  HEIGHT_DESC: "height-desc", // Sort by height in descending order
  AREA_ASC: "area-asc", // Sort by area in ascending order
  AREA_DESC: "area-desc", // Sort by area in descending order
}

// example
getContainPointChildren({
  point: new Point(100, 100),
  selector: ".annotation",
  sortBy: "area-asc",
})
```

##### hasChild

The hasChild function is used to determine if an element exists on the canvas. This function accepts a string parameter childId, which is the id of the element, and returns a boolean value. true means it exists, and false means it does not exist.

```typescript
// example
hasChild(image.id)
```

##### fix

The fix function is used to adjust all elements on the canvas to the bottom layer, which is equivalent to setting the layer of all elements to 0.

```typescript
// example
fix()
```

##### switchState

The switchState function is used to change the current state. This function accepts a string parameter state. After switching the state, the values in stateStore will be cleared.

```typescript
// example
switchState("state1")
```

##### getChildrenBySelector

The getChildrenBySelector function is used to get elements found by the selector. The selector and sortBy parameters are the same as those in the getContainPointChildren function. The return value is an array of StayChild objects.

```typescript
// example
getChildrenBySelector({
  selector: ".annotation",
  sortBy: (a, b) => a.shape.area - b.shape.area,
})
```

##### getAvailiableStates

The getAvailiableStates function is a utility function. This function accepts a string and returns all the states that match the selector among the states that have appeared.

```typescript
// Suppose there are states state1, state2, state3, state4, state5, state6, state7, state8, state9, and state10 among the currently registered listeners, and the states that have been triggered are state1, state2, state3, state4, and state5.
// Specifically, when the selector is "all-state", all states are returned.
getAvailiableStates("all-state") // The return value is ["state1", "state2", "state3", "state4", "state5"]
getAvailiableStates("!state1") // The return value is ["state2", "state3", "state4", "state5"]
getAvailiableStates("all-state&!(state1|state2)") // The return value is ["state3", "state4", "state5"]
```

##### changeCursor

The changeCursor function is used to change the mouse cursor style. This function accepts a string parameter cursor, which is the style of the mouse cursor. For specific values, see <https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor>.

```typescript
// example
changeCursor("pointer")
```

##### moveStart

The moveStart function is used to start moving all elements on the canvas. Before calling the move function, you need to call this function to save the position before the move.

##### move

The move function is used to move all elements on the canvas. offsetX and offsetY represent the offset of the horizontal and vertical coordinates relative to the start.

```typescript
// example
// Suppose we need to implement the function of moving the entire canvas when dragging, the listener can be written like this:
export const MoveListener: ListenerProps = {
  name: "moveListener",
  event: ["startmove", "move"],
  state: ALLSTATE,
  callback: ({ e, composeStore, tools: { moveStart, move } }) => {
    const eventMap = {
      startmove: () => {
        moveStart()
        return {
          startMovePoint: new Point(e.x, e.y),
        }
      },
      move: () => {
        const { startMovePoint } = composeStore
        if (!startMovePoint) {
          return
        }
        move(e.x - startMovePoint.x, e.y - startMovePoint.y)
      },
    }
    return eventMap[e.name as keyof typeof eventMap]()
  },
}
```

##### zoom

The zoom function is used to zoom all elements on the canvas. This function accepts two parameters. The first parameter is the zoom ratio, usually e.deltaY. The second parameter is the zoom center point. When we implement the function of zooming with the mouse as the center, this parameter is the position of the mouse.

```typescript
// example
// Suppose we need to implement the function of zooming the entire canvas when the mouse wheel slides, the listener can be written like this:
export const ZoomListener: ListenerProps = {
  name: "zoomListener",
  event: ["zoomin", "zoomout"],
  state: ALLSTATE,
  callback: ({ e, tools: { zoom } }) => {
    zoom(e.deltaY, new Point(e.x, e.y))
  },
}
```

##### log

The log function saves the current canvas snapshot and stores the current canvas snapshot in the stack. After executing this function, you can call the redo and undo functions to revert the previous snapshots.

##### redo

Move forward to the next snapshot.

##### undo

Move backward to the previous snapshot.

The redo and undo functions are used to change the current canvas to the snapshot in the stack.

We can modify some code in the initial example's main.ts file to simply understand this functionality.

```diff
<script setup lang="ts">
- import { ListenerProps, Rectangle, StayCanvas } from "stay-canvas"
+ import { ALLSTATE, ListenerProps, Rectangle, StayCanvas } from "stay-canvas"

  const DragListener: ListenerProps = {
    name: "dragListener",
-   event: ["dragstart", "drag"],
+   event: ["dragstart", "drag", "dragend"],
-   callback: ({ e, composeStore, tools: { appendChild, updateChild } }) => {
+   callback: ({ e, composeStore, tools: { appendChild, updateChild, log } }) => {
      return {
        dragstart: () => ({
          dragStartPosition: e.point,
          dragChild: appendChild({
            shape: new Rectangle({
              x: e.x,
              y: e.y,
              width: 0,
              height: 0,
              props: { color: "red" },
            }),
            className: "annotation",
          }),
        }),
        drag: () => {
          const { dragStartPosition, dragChild } = composeStore
          const x = Math.min(dragStartPosition.x, e.x)
          const y = Math.min(dragStartPosition.y, e.y)
          const width = Math.abs(dragStartPosition.x - e.x)
          const height = Math.abs(dragStartPosition.y - e.y)
          updateChild({
            child: dragChild,
            shape: dragChild.shape.update({ x, y, width, height }),
          })
        },
+        dragend: () => {
+          log()
+        },
      }
    },
  }

+  // Add redo and undo listeners
+  const undoListener: ListenerProps = {
+    name: "undoListener",
+    event: "undo",
+    callback: ({ tools: { undo } }) => {
+      undo()
+    },
+  }
+
+  const redoListener: ListenerProps = {
+    name: "redoListener",
+    event: "redo",
+    callback: ({ tools: { redo } }) => {
+      redo()
+    },
+  }

  new StayCanvas({
    id: "demo",
    width: 500,
    height: 500,
    listenerList: [DragListener],
  })

+  // Add undo/redo buttons
+  const container = document.getElementById("demo")
+  if (container) {
+    const undoButton = document.createElement("button")
+    undoButton.innerText = "undo"
+    undoButton.style.marginLeft = "500px"
+    undoButton.addEventListener("click", () => {
+      stay.trigger("undo")
+    })
+    container.appendChild(undoButton)
+  
+    const redoButton = document.createElement("button")
+    redoButton.innerText = "redo"
+    redoButton.style.marginLeft = "500px"
+    redoButton.addEventListener("click", () => {
+      stay.trigger("redo")
+    })
+    container.appendChild(redoButton)
+  }

```

<video src="videos//redo-undo.mp4" controls="">
</video>

##### triggerAction

The triggerAction function is used to manually trigger an event. Its effect is the same as calling trigger, but you need to manually construct the Event object and pass in the triggerEvents object.

```typescript
type triggerEventsProps = { [key: string]: ActionEvent },
```

##### deleteListener

The deleteListener function is used to delete a listener. This function accepts a string parameter listenerName, which is the name of the listener. This function will delete the listener, and if the listener does not exist, it will not perform any operation.


### Event API

```typescript
type EventProps = {
  name: string
  trigger: valueof<typeof MOUSE_EVENTS> | valueof<typeof KEYBOARRD_EVENTS>
  conditionCallback?: (props: UserConditionCallbackProps): boolean
  successCallback?: (props: UserSuccessCallbackProps) => void | EventProps
}

export const MOUSE_EVENTS = {
  MOUSE_DOWN: "mousedown", // Mouse down event type constant, used in mouse down event listeners.
  MOUSE_UP: "mouseup", // Mouse up event type constant, used in mouse up event listeners.
  MOUSE_MOVE: "mousemove", // Mouse move event type constant, used in mouse move event listeners.
  WHEEL: "wheel", // Mouse wheel event type constant, used in mouse wheel event listeners.
  CLICK: "click", // Mouse click event type constant, used in mouse click event listeners.
  DB_CLICK: "dblclick", // Mouse double-click event type constant, used in mouse double-click event listeners.
  CONTEXT_MENU: "contextmenu", // Mouse right-click event type constant, used in mouse right-click event listeners.
} as const

export const KEYBOARRD_EVENTS = {
  KEY_DOWN: "keydown", // Keyboard down event type constant, used in keyboard down event listeners.
  KEY_UP: "keyup", // Keyboard up event type constant, used in keyboard up event listeners.
} as const
```

Next, we will introduce the various attributes in EventProps.

#### name

The name attribute is used to identify the event. This attribute is a string. When there are two events with the same name, the latter will overwrite the former.

#### trigger

The trigger indicates the trigger of the event. Currently, some values in MOUSE_EVENTS and KEYBOARRD_EVENTS are supported. See the above constant definitions for details.

##### Explanation

- If we want to customize an event to move the entire canvas move, the trigger condition for this event is that the user needs to hold down the Ctrl key on the keyboard and then drag with the left mouse button. The value of this trigger should be "mousemove" because when triggering this event, we need to know the position of the mouse and update the canvas in real time based on the mouse position. Using "keydown" and "mousedown" is not suitable because these two events will only be triggered once. We need a continuously triggered event, so we need to use "mousemove".

```typescript
const MoveEvent: EventProps = {
  name: "move",
  trigger: MOUSE_EVENTS.MOUSE_MOVE,
  conditionCallback: ({ e, store }) => {
    return e.pressedKeys.has("Control") && e.pressedKeys.has("mouse0")
  },
}
```

#### conditionCallback

The conditionCallback attribute accepts a function. The parameter of this function satisfies the UserConditionCallbackProps type constraint. The parameters e/store/stateStore are the same as the e/store/stateStore passed in the listener callback. See [Listener Callback Function](#listener-callback-function) for details. This function needs to return a boolean value. If it returns true, it means the trigger condition of the event is met. If it returns false, it means the trigger condition of the event is not met.

```typescript
export interface UserConditionCallbackFunction {
  (props: UserConditionCallbackProps): boolean
}

export interface UserConditionCallbackProps {
  e: ActionEvent
  store: storeType
  stateStore: storeType
}
```

The conditionCallback is an optional parameter. When we do not pass this parameter, it means that the event will be triggered when the trigger condition is met. For example, if we need to define a mouse down event, we can define it as follows:

```typescript
const MouseDownEvent: EventProps = {
  name: "mousedown",
  trigger: MOUSE_EVENTS.MOUSE_DOWN,
}
```

#### successCallback

The successCallback attribute accepts a function. The parameter of this function satisfies the UserSuccessCallbackProps type constraint. The parameters e/store/stateStore are the same as the e/store/stateStore passed in the listener callback. See [Listener Callback Function](#listener-callback-function) for details. At the same time, there is an additional deleteEvent function in the parameter, which is used to delete the event. This function also accepts an optional return value. When the return value is of type EventProps, the returned event will be registered after the event is triggered.

This function will be very useful in some cases. One scenario is when we need to define a set of drag events. One approach is to define three events: start drag, dragging, and end drag. However, we want the dragging event to be effective only after the start drag event is triggered, so we can avoid the situation where the mouse is pressed outside the canvas and then moved into the canvas directly triggering the drag event. This way, we cannot get the mouse position when the drag starts. We also want to trigger the end drag event only after the drag event is triggered. Imagine if the user directly clicks in the canvas. Then, we will first trigger the start drag event, then skip the drag event, and directly trigger the end drag event. This may result in unexpected outcomes in some cases.

The following is a registration method for drag events:

```typescript
// Define the end drag event
const DragEndEvent: EventProps = {
  name: "dragend", // Event name
  trigger: MOUSE_EVENTS.MOUSE_UP, // Trigger condition, here is mouse up
  successCallback: ({ store, deleteEvent }) => {
    deleteEvent("drag") // Delete the ongoing drag event in the success callback
    deleteEvent("dragend") // Delete the end drag event itself
    store.set("dragging", false) // Update the state to indicate that dragging has ended
  },
}

// Define the ongoing drag event
const DragEvent: EventProps = {
  name: "drag", // Event name
  trigger: MOUSE_EVENTS.MOUSE_MOVE, // Trigger condition, mouse move
  conditionCallback: ({ e, store }) => {
    const dragStartPosition: Point = store.get("dragStartPosition")
    return (
      e.pressedKeys.has("mouse0") && // Check if the left mouse button is pressed
      (dragStartPosition.distance(e.point) >= 10 || store.get("dragging")) // Check if the mouse has moved a sufficient distance or is already in a dragging state
    )
  },
  successCallback: ({ store }) => {
    store.set("dragging", true) // Set the state to dragging
    return DragEndEvent // Return the end drag event to register it
  },
}

// Define the start drag event
export const DragStartEvent: EventProps = {
  name: "dragstart", // Event name
  trigger: MOUSE_EVENTS.MOUSE_DOWN, // Trigger condition, mouse down
  conditionCallback: ({ e }) => {
    return e.pressedKeys.has("mouse0") // Left mouse button pressed
  },
  successCallback: ({ e, store }) => {
    store.set("dragStartPosition", e.point) // Store the mouse position when dragging starts
    return DragEvent // Return the ongoing drag event to register it
  },
}

// The event registration list only contains the start drag event, and other events are dynamically registered through callbacks
const eventList = [DragStartEvent]
```

`DragStartEvent`: Defines a start drag event. It is triggered when the left mouse button is pressed. In the success callback, it sets the starting position of the drag and returns the DragEvent object to register this event, starting to track the dragging movement.

`DragEvent`: Defines an ongoing drag event. This event is triggered when the mouse moves, but only if certain conditions are met (the left mouse button is pressed, and the movement distance is greater than 10 pixels or is already in a dragging state). Its success callback sets the state to dragging and returns the DragEndEvent object to register the end drag event.

`DragEndEvent`: Defines an end drag event. It is triggered when the mouse button is released. In the success callback, it clears all events related to dragging (including the ongoing drag and its own end drag event) and sets the dragging state to false.

### trigger Function API
You can use the trigger function to manually trigger events. Sometimes you may need to trigger events outside the canvas, such as changing the state of the entire canvas, loading some data, saving some data, etc. You may want the user to trigger by clicking a button outside the canvas or automatically trigger it. Then, you can use the trigger function to achieve this.

This function accepts two parameters. The first parameter is the event name, and the second parameter is the event payload, which will be passed to the [Listener Callback Function](#listener-callback-function)'s payload parameter.

```typescript
export type Dict = Record<string, any>
export type TriggerFunction = (name: string, payload?: Dict) => void

// example:
export const StateChangeListener: ListenerProps = {
  name: "changeState",
  event: "changeState",
  state: ALLSTATE,
  callback: ({ tools: { switchState }, payload }) => {
    switchState(payload.state)
  },
}
// Externally call trigger to trigger the changeState event, thereby executing the callback function corresponding to the StateChangeListener
stay.trigger("changeState", { state: "draw" })
```


### setListenerList Function API
Sometimes we may not register all listeners at the beginning. In this case, we can use the setListenerList function to dynamically register listeners. This function accepts one parameter, which is a list of listeners. Using this function will replace all listeners in stay-canvas with the listeners in this parameter.

```typescript
stay.setListenerList(listeners)
```


### setEventList Function API
Similar to the setListenerList function, this function accepts one parameter, which is a list of events. Using this function will replace all events in stay-canvas with the events in this parameter.

```typescript
stay.setEventList(events)
```
