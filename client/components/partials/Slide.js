import Utils from '../../utils/Utils'
import Store from '../../store'
import Constants from '../../constants'

export default (container, project, index)=> {
  let scope
  const createPlane = (texture) => {
    const plane = {
      mesh: new PIXI.mesh.Plane(texture, 2, 2)
    }
    plane.verts = plane.mesh.vertices
    plane.iverts = plane.verts.slice(0)
    return plane
  }
  const load = (done) => {
    Utils.pixiLoadTexture(`preview-${scope.index}`, `assets/${scope.project.image}`, (data) => {
      scope.plane = createPlane(data.texture)
      scope.mesh = scope.plane.mesh
      scope.container.addChild(scope.mesh)
      scope.isLoaded = true
      done()
    })
  }
  const resize = (i) => {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    const marginScale = 0.7
    const resizeVars = Utils.resizePositionProportionally(windowW * marginScale, windowH * marginScale, Constants.MEDIA_GLOBAL_W, Constants.MEDIA_GLOBAL_H)
    if (scope.isLoaded) {
      scope.mesh.scale.set(resizeVars.scale, resizeVars.scale)
      scope.mesh.position.x = (windowW >> 1) - (resizeVars.width >> 1)
      scope.mesh.position.y = ((windowH >> 1) - (resizeVars.height >> 1)) + (i * windowH)
    }
  }
  const animate = () => {
    scope.delta += 0.01
    const currentSlide = scope.plane
    const nextNx = Math.max(Store.Mouse.nX - 0.4, 0) * 0.2
    const offsetX = nextNx * 400
    const offsetY = nextNx * 300
    const easing = Math.max(0.1 * nextNx * 13.6, 0.1)
    Utils.planeAnim(currentSlide, Store.Mouse, scope.delta, offsetX, offsetY, easing)
  }
  scope = {
    plane: undefined,
    mesh: undefined,
    isLoaded: false,
    delta: 0,
    animate,
    resize,
    project,
    index,
    container,
    load
  }
  return scope
}
