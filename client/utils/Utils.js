import Constants from '../constants'
import dom from 'dom-hand'

class Utils {
  static normalizeMouseCoords(e, objWrapper) {
    let posx = 0
    let posy = 0
    if (e.pageX || e.pageY) {
      posx = e.pageX
      posy = e.pageY
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
    }
    objWrapper.x = posx
    objWrapper.y = posy
    return objWrapper
  }
  static resizePositionProportionally(windowW, windowH, contentW, contentH, orientation) {
    const aspectRatio = contentW / contentH
    let scale
    if (orientation !== undefined) {
      if (orientation === Constants.LANDSCAPE) {
        scale = (windowW / contentW) * 1
      } else {
        scale = (windowH / contentH) * 1
      }
    } else {
      scale = ((windowW / windowH) < aspectRatio) ? (windowH / contentH) * 1 : (windowW / contentW) * 1
    }
    const newW = contentW * scale
    const newH = contentH * scale
    const css = {
      width: newW,
      height: newH,
      left: (windowW >> 1) - (newW >> 1),
      top: (windowH >> 1) - (newH >> 1),
      scale: scale
    }
    return css
  }
  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  static supportWebGL() {
    try {
      const canvas = document.createElement( 'canvas' )
      return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) )
    } catch ( e ) {
      return false
    }
  }
  static destroyVideo(video) {
    video.pause()
    video.src = ''
    const children = video.childNodes
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.setAttribute('src', '')
      // Working with a polyfill or use jquery
      dom.tree.remove(child)
    }
  }
  static destroyVideoTexture(texture) {
    const video = texture.baseTexture.source
    Utils.destroyVideo(video)
  }
  static rand(min, max, decimals) {
    const randomNum = Math.random() * (max - min) + min
    if (decimals === undefined) {
      return randomNum
    }
    const d = Math.pow(10, decimals)
    return ~~((d * randomNum) + 0.5) / d
  }
  static getImgUrlId(url) {
    const split = url.split('/')
    return split[split.length - 1].split('.')[0]
  }
  static style(div, style) {
    div.style.webkitTransform = style
    div.style.mozTransform    = style
    div.style.msTransform     = style
    div.style.oTransform      = style
    div.style.transform       = style
  }
  static translate(div, x, y, z) {
    if ('webkitTransform' in document.body.style || 'mozTransform' in document.body.style || 'oTransform' in document.body.style || 'transform' in document.body.style) {
      Utils.style(div, 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)')
    } else {
      div.style.top = y + 'px'
      div.style.left = x + 'px'
    }
  }
  static guiVec3(gui, folderName, vec3, offsetX, offsetY, offsetZ, opened = true) {
    const folder = gui.addFolder(folderName)
    folder.add(vec3, 'x', vec3.x - offsetX, vec3.x + offsetX).onChange((value) => { vec3.x = value })
    folder.add(vec3, 'y', vec3.y - offsetY, vec3.y + offsetY).onChange((value) => { vec3.y = value })
    folder.add(vec3, 'z', vec3.z - offsetZ, vec3.z + offsetZ).onChange((value) => { vec3.z = value })
    if (opened) folder.open()
  }
  static pixiLoadTexture(id, url, cb) {
    let scope
    const loader = new PIXI.loaders.Loader()
    loader.add(id, url)
    loader.load()
    loader.once('complete', (data, resources) => {
      scope.texture = resources[scope.id].texture
      cb(scope)
    })
    scope = {
      loader,
      id,
      url
    }
    return scope
  }
  static planeAnim(plane, mouse, delta, offsetX, offsetY, easing) {
    const ntlx = ((plane.iverts[0] + Math.sin(mouse.nX - 0.5) * 50) - plane.verts[0] + offsetX) * easing
    const ntly = ((plane.iverts[1] + Math.cos(mouse.nY) * 10) - plane.verts[1] - offsetY) * easing
    const ntrx = ((plane.iverts[2] + Math.sin(mouse.nX + 0.5) * 50) - plane.verts[2] + offsetX) * easing
    const ntry = ((plane.iverts[3] + Math.cos(mouse.nY) * 30) - plane.verts[3] + offsetY) * easing
    const nblx = ((plane.iverts[4] + Math.sin(mouse.nX - 0.4) * 80) - plane.verts[4] + offsetX) * easing
    const nbly = ((plane.iverts[5] + Math.cos(mouse.nY - 0.6) * 40) - plane.verts[5] + offsetY) * easing
    const nbrx = ((plane.iverts[6] + Math.sin(mouse.nX + 0.4) * 80) - plane.verts[6] + offsetX) * easing
    const nbry = ((plane.iverts[7] + Math.cos(mouse.nY - 0.6) * 20) - plane.verts[7] - offsetY) * easing
    plane.verts[0] += ntlx + Math.cos(delta) * 2
    plane.verts[1] += ntly - Math.sin(delta) * 3
    plane.verts[2] += ntrx - Math.cos(delta) * 1
    plane.verts[3] += ntry + Math.sin(delta) * 4
    plane.verts[4] += nblx + Math.cos(delta) * 1
    plane.verts[5] += nbly - Math.sin(delta) * 2
    plane.verts[6] += nbrx + Math.cos(delta) * 2
    plane.verts[7] += nbry - Math.sin(delta) * 1
  }
}

export default Utils
