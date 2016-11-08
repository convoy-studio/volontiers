import Utils from '../../utils/Utils'
import Store from '../../store'
import Constants from '../../constants'
import bezier from 'cubic-bezier'

const STATE = {
  ACTIVE: 'ACTIVE',
  DEACTIVE: 'DEACTIVE',
  TRANSITION_IN: 'TRANSITION_IN',
  TRANSITION_OUT: 'TRANSITION_OUT',
  SCALE_UP: 'SCALE_UP',
  SCALE_DOWN: 'SCALE_DOWN'
}
const scaleUpBezier = bezier(1, 0.01, 0.14, 1.01, 1000)
const scaleDownBezier = bezier(1, 0.01, 0.14, 1.01, 1000)
let scaleUpTime = 0
let scaleDownTime = 0
const transitionHideBezier = bezier(1, 0.01, 0.14, 1.01, 1000)
const transitionShowBezier = bezier(1, 0.01, 0.14, 1.01, 1000)
let transitionHideTime = 0
let transitionShowTime = 0

export default (id, container, imgFilename, index, pre = 'preview', direction = { from: Constants.RIGHT, to: Constants.CENTER }, defaultPosition = Constants.CENTER)=> {
  let scope
  const createPlane = (texture) => {
    const plane = {}
    plane.mesh = new PIXI.mesh.Plane(texture, 2, 2)
    plane.verts = plane.mesh.vertices
    plane.iverts = plane.verts.slice(0)
    plane.fverts = undefined
    return plane
  }
  const load = (done) => {
    Utils.pixiLoadTexture(`${pre}-${scope.index}`, `assets/${scope.imgFilename}`, (data) => {
      scope.size[0] = data.texture.width
      scope.size[1] = data.texture.height
      scope.plane = createPlane(data.texture)
      scope.plane.size = scope.size
      scope.mesh = scope.plane.mesh
      scope.container.addChild(scope.mesh)
      scope.isLoaded = true
      done(scope.plane, scope.index)
    })
  }
  const resize = () => {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    const orientation = scope.size[0] > scope.size[1] ? undefined : Constants.ORIENTATION.PORTRAIT
    const marginScale = orientation === Constants.ORIENTATION.PORTRAIT ? 0.8 : 0.63
    const resizeVars = Utils.resizePositionProportionally(windowW * marginScale, windowH * marginScale, scope.size[0], scope.size[1], orientation)
    if (scope.isLoaded) {
      scope.mesh.scale.set(resizeVars.scale, resizeVars.scale)
      Utils.setDefaultPlanePositions(scope.plane, scope.defaultPosition)
    }
    return resizeVars
  }
  const animate = () => {
    if (scope.state === STATE.DEACTIVE) return
    scope.delta += 0.01
    const currentSlide = scope.plane
    const nextNx = Math.max(Store.Mouse.nX - 0.4, 0) * 0.2
    const offsetX = nextNx * 400
    const offsetY = nextNx * 300
    const easing = Math.max(0.1 * nextNx * 13.6, 0.1)
    switch (scope.state) {
    case STATE.ACTIVE:
      Utils.planeAnim(currentSlide, Store.Mouse, scope.delta, offsetX, offsetY, easing)
      break
    case STATE.SCALE_UP:
      scaleUpTime += 0.01
      const scaleUp = Math.min(scaleUpBezier(scaleUpTime), 1)
      Utils.planeTransition(currentSlide, scaleUp, scope.direction)
      break
    case STATE.SCALE_DOWN:
      scaleDownTime += 0.01
      const scaleDown = Math.min(scaleDownBezier(scaleDownTime), 1)
      Utils.planeTransition(currentSlide, scaleDown, scope.direction)
      break
    case STATE.TRANSITION_IN:
      transitionShowTime += 0.01
      const easeIn = transitionShowBezier(transitionShowTime)
      if (transitionShowTime >= 1) scope.activate()
      Utils.planeTransition(currentSlide, easeIn, scope.direction)
      break
    case STATE.TRANSITION_OUT:
      transitionHideTime += 0.01
      const easeOut = transitionHideBezier(transitionHideTime)
      if (transitionHideTime >= 1) scope.deactivate()
      Utils.planeTransition(currentSlide, easeOut, scope.direction)
      break
    default:
    }
  }
  const show = (dir) => {
    scope.direction = dir
    scope.activate()
    transitionShowTime = 0
    Utils.updateGoToPlanePositions(scope.plane, dir.to)
    scope.state = STATE.TRANSITION_IN
  }
  const hide = (dir) => {
    removeEvents()
    scope.direction = dir
    transitionHideTime = 0
    Utils.updateGoToPlanePositions(scope.plane, dir.to)
    scope.state = STATE.TRANSITION_OUT
  }
  const onProjectsOverviewOpen = () => {
    scope.direction = { from: Constants.CENTER, to: Constants.SMALL }
    scaleDownTime = 0
    Utils.updateGoToPlanePositions(scope.plane, scope.direction.to)
    scope.state = STATE.SCALE_DOWN
  }
  const onProjectsOverviewClose = () => {
    scope.direction = { from: Constants.SMALL, to: Constants.CENTER }
    scaleUpTime = 0
    Utils.updateGoToPlanePositions(scope.plane, scope.direction.to)
    scope.state = STATE.SCALE_UP
    setTimeout(() => {
      scope.activate()
      removeEvents()
    }, 500)
  }
  const activate = () => {
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, onProjectsOverviewOpen)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, onProjectsOverviewClose)
    scope.state = STATE.ACTIVE
  }
  const deactivate = () => {
    scope.state = STATE.DEACTIVE
    removeEvents()
  }
  const removeEvents = () => {
    Store.off(Constants.OPEN_PROJECTS_OVERVIEW, onProjectsOverviewOpen)
    Store.off(Constants.CLOSE_PROJECTS_OVERVIEW, onProjectsOverviewClose)
  }
  const clear = () => {
    removeEvents()
    if (scope.mesh) {
      scope.mesh.destroy()
      scope.container.removeChild(scope.mesh)
    }
    if (scope.plane) {
      scope.plane.iverts = null
      scope.plane.fverts = null
    }
  }
  scope = {
    plane: undefined,
    mesh: undefined,
    isLoaded: false,
    delta: 0,
    state: STATE.DEACTIVE,
    size: [0, 0],
    id,
    defaultPosition,
    direction,
    activate,
    deactivate,
    show,
    hide,
    animate,
    resize,
    imgFilename,
    index,
    container,
    clear,
    load
  }
  return scope
}
