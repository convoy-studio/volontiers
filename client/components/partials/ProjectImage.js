import BaseComponent from '../../pager/components/BaseComponent'
import Data from '../../data'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import utils from '../../utils/Utils'
import dom from 'dom-hand'

class ProjectImage extends BaseComponent {
  constructor(props) {
    super(props)
    this.slug = this.props.slug
    Store.Window.w = window.innerWidth
    Store.Window.h = window.innerHeight
    this.lastPlaneIdx = 0
    this.currentPlaneIdx = 0
    this.currentScroll = 0
    this.isScrolling = false
    this.delta = 0 // Used for update movement animation
    this.halfMargin = 80
    this.margin = 180
    this.planes = [] // All planes array
    this.planesInitialVertices = [] // All initial vertices of all planes
    this.onceRight = false // Used for mouseMove animation : test if transitioning
    this.onceLeft = false // Used for mouseMove animation : test if transitioning
    this.hoverPreview = 150 // Used for mouseMove animation : movement max of vertex
    this.tweenValue = { // Used for mouseMove animation
      v: 0
    }
    this.toggleSlided = false
  }
  render() {
    return (
      <div ref="projectImage" className="project-image">
      </div>
    )
  }
  componentDidMount() {
    Store.on(Constants.PROJECT_IMAGES_LOADED, this.addListeners)
    Store.on(Constants.WINDOW_RESIZE, this.resize)
    Store.on(Constants.TOGGLE_PROJECT_INFOS, this.toggleSlide)
    this.loadPreview()
    let windowW = Store.Window.w
    let windowH = Store.Window.h
    this.parent = this.refs.projectImage
    this.renderer = new PIXI.WebGLRenderer(windowW, windowH, {antialias: true, roundPixels: true})
    this.renderer.backgroundColor = 0xffffff
    this.parent.appendChild(this.renderer.view)
    this.stage = new PIXI.Container()
    this.container = new PIXI.Container()
    this.stage.addChild(this.container)
  }
  loadPreview() {
    let loader = new PIXI.loaders.Loader()
    for (let i = 0; i < Data.projects[this.slug].assets.length; i++) {
      loader.add(`preview-${i}`, `assets/images/${Data.projects[this.slug].assets[i]}`)
    }
    loader.on('complete', this.completeLoader)
    loader.load()
  }
  completeLoader() {
    for (let i = 0; i < Data.projects[this.slug].assets.length; i++) {
      let texture = new PIXI.Texture.fromImage(`assets/images/${Data.projects[this.slug].assets[i]}`)
      this.createPlane(texture, i)
    }
    Actions.projectImagesLoaded()
  }

  createPlane(texture, idx) {
    let previewH = Store.Window.h - this.margin
    this.planes[idx] = {}
    this.planes[idx].mesh = new PIXI.mesh.Plane(texture, 2, 2)
    this.planes[idx].mesh.height = previewH
    this.planes[idx].mesh.width = (this.planes[idx].mesh.height * texture.baseTexture.width) / texture.baseTexture.height
    this.planes[idx].mesh.position.y = this.halfMargin
    let left = ((Store.Window.w - this.planes[idx].mesh.width) / 2) + (idx * Store.Window.w)
    this.planes[idx].mesh.position.x = left
    this.container.addChild(this.planes[idx].mesh)
    this.planesInitialVertices[idx] = this.planes[idx].mesh.vertices
  }
  addListeners() {
    console.log('generate')
    TweenMax.ticker.addEventListener('tick', this.update.bind(this))
    this.initialTopRightVertex = this.planesInitialVertices[this.currentPlaneIdx][3]
    this.initialBottomRightVertex = this.planesInitialVertices[this.currentPlaneIdx][7]
    this.initialTopLeftVertex = this.planesInitialVertices[this.currentPlaneIdx][0]
    this.initialBottomLeftVertex = this.planesInitialVertices[this.currentPlaneIdx][5]
    dom.event.on(this.refs.projectImage, 'mousemove', this.mouseMove)
    dom.event.on(this.refs.projectImage, 'click', this.mouseClick)
    // this.onScroll()
  }
  resize() {
    let windowW = Store.Window.w
    let windowH = Store.Window.h
    this.renderer.view.style.width = windowW + 'px'
    this.renderer.view.style.height = windowH + 'px'
    this.renderer.resize(windowW, windowH)
    for (let i = 0; i < Data.projects[this.slug].assets.length; i++) {
      let previewH = windowH - this.margin
      this.planes[i].mesh.height = previewH
      this.planes[i].mesh.width = (this.planes[i].mesh.height * this.planes[i].mesh.texture.baseTexture.width) / this.planes[i].mesh.texture.baseTexture.height
      this.planes[i].mesh.position.y = this.halfMargin
      let left = ((windowW - this.planes[idx].mesh.width) / 2) + (idx * windowW)
      this.planes[i].mesh.position.x = left
    }
    // Reset scroll
    TweenMax.to(this.container.position, 0.5, {y: 0, ease: Circ.easeOut})
  }
  update() {
    this.delta += 0.01
    for (let k = 0; k < this.planes.length; k++) {
      for (let i = 0; i < this.planes[k].mesh.vertices.length; i++) {
        this.planes[k].mesh.vertices[i] = this.planesInitialVertices[k][i] + (Math.sin((i * 0.9) + this.delta)) / 6
      }
    }
    this.renderer.render(this.stage)
  }
  toggleSlide() {
    let sign = 1
    if (!this.toggleSlided) sign = -1
    TweenMax.to(this.container.position, 0.3, {
      y: this.container.position.y + Store.Window.h * sign,
      onComplete: () => {
        this.toggleSlided = !this.toggleSlided
      }
    })
  }
  mouseMove() {
    if (Store.Mouse.y > this.halfMargin && Store.Mouse.y < Store.Window.h - (this.halfMargin) && Store.Mouse.x > Store.Window.w / 2) { // Test if on right preview area
      if (!this.onceRight && !this.onceLeft && this.tweenValue.v === 0) {
        Actions.mouseEnterRightProject()
        let planeIdx = this.currentPlaneIdx
        TweenMax.to(this.tweenValue, 0.3, {
          v: this.hoverPreview,
          ease: Sine.easeOut,
          onUpdate: () => {
            this.planesInitialVertices[planeIdx][0] = this.initialTopLeftVertex - this.tweenValue.v
            this.planesInitialVertices[planeIdx][3] = this.initialTopRightVertex + this.tweenValue.v
            this.planesInitialVertices[planeIdx][5] = this.initialBottomLeftVertex + this.tweenValue.v
            this.planesInitialVertices[planeIdx][7] = this.initialBottomRightVertex - this.tweenValue.v
          },
          onComplete: () => {
            this.onceRight = true
          }
        })
      }
      if (this.onceLeft && this.tweenValue.v === this.hoverPreview) {
        Actions.mouseLeaveLeftProject()
        let planeIdx = this.currentPlaneIdx
        let resetValues = {
          tl: this.planesInitialVertices[planeIdx][0],
          bl: this.planesInitialVertices[planeIdx][5],
          tr: this.planesInitialVertices[planeIdx][3],
          br: this.planesInitialVertices[planeIdx][7]
        }
        TweenMax.to(resetValues, 0.3, {
          tl: this.initialTopLeftVertex,
          bl: this.initialBottomLeftVertex,
          tr: this.initialTopRightVertex,
          br: this.initialBottomRightVertex,
          ease: Sine.easeOut,
          onUpdate: () => {
            this.planesInitialVertices[planeIdx][0] = resetValues.tl
            this.planesInitialVertices[planeIdx][3] = resetValues.tr
            this.planesInitialVertices[planeIdx][5] = resetValues.bl
            this.planesInitialVertices[planeIdx][7] = resetValues.br
          },
          onComplete: () => {
            this.onceLeft = false
            this.tweenValue.v = 0
          }
        })
      }
    } else if (Store.Mouse.y > this.halfMargin && Store.Mouse.y < Store.Window.h - (this.halfMargin) && Store.Mouse.x < Store.Window.w / 2) {
      if (!this.onceLeft && !this.onceRight && this.tweenValue.v === 0) {
        Actions.mouseEnterLeftProject()
        let planeIdx = this.currentPlaneIdx
        TweenMax.to(this.tweenValue, 0.3, {
          v: this.hoverPreview,
          ease: Sine.easeOut,
          onUpdate: () => {
            this.planesInitialVertices[planeIdx][0] = this.initialTopLeftVertex + this.tweenValue.v
            this.planesInitialVertices[planeIdx][3] = this.initialTopRightVertex - this.tweenValue.v
            this.planesInitialVertices[planeIdx][5] = this.initialBottomLeftVertex - this.tweenValue.v
            this.planesInitialVertices[planeIdx][7] = this.initialBottomRightVertex + this.tweenValue.v
          },
          onComplete: () => {
            this.onceLeft = true
          }
        })
      }
      if (this.onceRight && this.tweenValue.v === this.hoverPreview) {
        Actions.mouseLeaveRightProject()
        let planeIdx = this.currentPlaneIdx
        let resetValues = {
          tl: this.planesInitialVertices[planeIdx][0],
          bl: this.planesInitialVertices[planeIdx][5],
          tr: this.planesInitialVertices[planeIdx][3],
          br: this.planesInitialVertices[planeIdx][7]
        }
        TweenMax.to(resetValues, 0.3, {
          tl: this.initialTopLeftVertex,
          bl: this.initialBottomLeftVertex,
          tr: this.initialTopRightVertex,
          br: this.initialBottomRightVertex,
          ease: Sine.easeOut,
          onUpdate: () => {
            this.planesInitialVertices[planeIdx][0] = resetValues.tl
            this.planesInitialVertices[planeIdx][3] = resetValues.tr
            this.planesInitialVertices[planeIdx][5] = resetValues.bl
            this.planesInitialVertices[planeIdx][7] = resetValues.br
          },
          onComplete: () => {
            this.onceRight = false
            this.tweenValue.v = 0
          }
        })
      }
    }
  }

  mouseClick() {
    if (Store.Mouse.y > this.halfMargin && Store.Mouse.y < Store.Window.h - (this.halfMargin) && Store.Mouse.x > Store.Window.w / 2) { // Test if on left preview area
      this.scroll('right')
    } else {
      this.scroll('left')
    }
  }

  scroll(direction) {
    let toScroll = 0
    let needScroll = false
    if (this.currentPlaneIdx >= 0 && this.currentPlaneIdx < this.planes.length && !this.isScrolling) {
      if (direction === 'right' && this.currentPlaneIdx < this.planes.length - 1) {
        toScroll = - Math.floor(Store.Window.w)
        this.isScrolling = true
        this.lastPlaneIdx = this.currentPlaneIdx
        this.currentPlaneIdx++
        needScroll = true
        dom.event.off(this.refs.projectImage, 'mousemove', this.mouseMove)
        console.log('▶️')
      } else if (direction === 'left' && this.currentPlaneIdx > 0) {
        toScroll = Math.floor(Store.Window.w)
        this.isScrolling = true
        this.lastPlaneIdx = this.currentPlaneIdx
        this.currentPlaneIdx--
        needScroll = true
        dom.event.off(this.refs.projectImage, 'mousemove', this.mouseMove)
        console.log('◀️')
      }
      if (needScroll) {
        this.currentScroll = this.currentScroll + toScroll
        TweenMax.to(this.container.position, 0.5, {x: this.currentScroll, ease: Circ.easeOut, onComplete: () => {
          this.isScrolling = false

          // Reset plane vertices & add listener
          this.planesInitialVertices[this.lastPlaneIdx][0] = this.initialTopLeftVertex
          this.planesInitialVertices[this.lastPlaneIdx][3] = this.initialTopRightVertex
          this.planesInitialVertices[this.lastPlaneIdx][5] = this.initialBottomLeftVertex
          this.planesInitialVertices[this.lastPlaneIdx][7] = this.initialBottomRightVertex
          this.initialTopRightVertex = this.planesInitialVertices[this.currentPlaneIdx][3]
          this.initialBottomRightVertex = this.planesInitialVertices[this.currentPlaneIdx][7]
          this.initialTopLeftVertex = this.planesInitialVertices[this.currentPlaneIdx][0]
          this.initialBottomLeftVertex = this.planesInitialVertices[this.currentPlaneIdx][5]
          this.onceRight = false
          this.tweenValue.v = 0
          Actions.changeProjectSlide(this.currentPlaneIdx)
          dom.event.on(this.refs.projectImage, 'mousemove', this.mouseMove)
        }})
      }
    }
  }
}

export default ProjectImage
