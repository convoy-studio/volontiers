import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import SVGComponent from './SVGComponent'

class Logo extends BaseComponent {
  constructor(props) {
    super(props)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onLogoClick = this.onLogoClick.bind(this)
    this.playAboutAnim = this.playAboutAnim.bind(this)
    this.toggleOutAnim = this.toggleOutAnim.bind(this)
    this.hoverable = true
    this.about = false
    Store.on(Constants.TOGGLE_ABOUT, this.playAboutAnim)
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, this.toggleOutAnim)
  }
  render() {
    let classNames = this.props.className
    return (
      <div ref="logo" className={classNames} onClick={this.onLogoClick}>
        <SVGComponent viewBox="0 0 952.4 531.1">
          <g className="letter-s" ref="letter-s">
            <g>
              <path d="M509.9,95.5c0-28.2-22.8-51-51-51V19h-44.2c-4.3,7.5-6.8,16.2-6.8,25.5c0,28.2,22.8,51,51,51v25.5h44.2
                C507.4,113.6,509.9,104.8,509.9,95.5z"/>
            </g>
            <circle cx="458.9" cy="31.8" r="12.8"/>
            <circle cx="458.9" cy="108.3" r="12.8"/>
          </g>
          <g className="letter-r" ref="letter-r">
            <path d="M510.2,70c0-28.2-22.8-51-51-51h-51v102h51c51,0,51,0,51,0L500,100.6C506.4,92.1,510.2,81.5,510.2,70z M459.2,87
              c-9.4,0-17-7.6-17-17s7.6-17,17-17c9.4,0,17,7.6,17,17S468.6,87,459.2,87z"/>
            <circle className="st0" cx="459.2" cy="70" r="17"/>
            <circle cx="459.2" cy="70" r="12.8"/>
          </g>
          <g className="letter-t" ref="letter-t">
            <rect x="442" y="-14.8" transform="matrix(3.815443e-11 -1 1 3.815443e-11 422.9658 494.9973)" width="34" height="101.6"/>
            <rect x="441.9" y="19" transform="matrix(-1 -8.965063e-11 8.965063e-11 -1 917.7698 140.063)" width="34" height="102"/>
          </g>
          <g className="letter-v" ref="letter-v">
            <g>
              <polygon points="442,121.1 459,121.1 408,19 		"/>
              <polygon points="459,121.1 476,121.1 510,19 		"/>
            </g>
            <polygon className="st0" points="459,121.1 408,19 510,19 	"/>
          </g>
          <g className="letter-n" ref="letter-n">
            <path d="M494.7,19c-10.2,0-18.7,8.3-18.7,18.5V87l-33.8-68H408v102h34.2c15.7,0,26.5,0,34,0h17H510V19H494.7z"/>
            <circle className="st0" cx="493.2" cy="36" r="17"/>
            <circle cx="493.2" cy="36" r="12.8"/>
          </g>
          <g className="letter-e" ref="letter-e">
            <rect x="407.9" y="19" width="34" height="102"/>
            <rect x="433.4" y="61.5" transform="matrix(4.502627e-11 -1 1 4.502627e-11 346.3337 554.4282)" width="34" height="85"/>
            <rect x="433.4" y="-6.5" transform="matrix(4.502627e-11 -1 1 4.502627e-11 414.3652 486.3967)" width="34" height="85"/>
            <circle cx="458.9" cy="70" r="17"/>
            <rect x="416.4" y="44.5" transform="matrix(4.502627e-11 -1 1 4.502627e-11 363.3416 503.4046)" width="34" height="51"/>
            <circle className="st0" cx="458.9" cy="70" r="17"/>
            <circle cx="458.9" cy="70" r="12.8"/>
            <circle className="st0" cx="492.9" cy="104" r="17"/>
            <circle cx="492.9" cy="104" r="12.8"/>
            <circle className="st0" cx="492.9" cy="36" r="17"/>
            <circle cx="492.9" cy="36" r="12.8"/>
          </g>
          <g className="letter-l" ref="letter-l">
            <rect x="407.9" y="19" width="34" height="102"/>
            <rect x="433.4" y="61.5" transform="matrix(4.497209e-11 -1 1 4.497209e-11 346.3337 554.4282)" width="34" height="85"/>
            <g>
              <circle className="st0" cx="492.9" cy="104" r="17"/>
              <circle cx="492.9" cy="104" r="12.8"/>
            </g>
          </g>
          <g className="letter-o_2" ref="letter-o_2">
            <path className="st0" d="M459.2,19c-28.2,0-51,22.8-51,51s22.8,51,51,51s51-22.8,51-51S487.4,19,459.2,19z M459.2,87
              c-9.4,0-17-7.6-17-17s7.6-17,17-17s17,7.6,17,17S468.6,87,459.2,87z"/>
            <g>
              <path d="M459.2,85.3c-8.4,0-15.3-6.8-15.3-15.3s6.8-15.3,15.3-15.3c8.4,0,15.3,6.8,15.3,15.3S467.6,85.3,459.2,85.3z"/>
              <path className="st1" d="M459.2,57.3c7,0,12.8,5.7,12.8,12.8s-5.7,12.8-12.8,12.8s-12.8-5.7-12.8-12.8S452.2,57.3,459.2,57.3
                 M459.2,52.3c-9.8,0-17.8,8-17.8,17.8s8,17.8,17.8,17.8c9.8,0,17.8-8,17.8-17.8S469,52.3,459.2,52.3L459.2,52.3z"/>
            </g>
          </g>
          <g className="letter-i" ref="letter-i">
            <rect x="441.9" y="19" width="34" height="102"/>
            <circle className="st0" cx="458.9" cy="19" r="17"/>
            <circle cx="458.9" cy="19" r="12.8"/>
          </g>
          <g className="letter-o_1" ref="letter-o_1">
            <path className="st0" d="M458.9,19c-28.2,0-51,22.8-51,51c0,28.2,22.8,51,51,51s51-22.8,51-51C509.9,41.9,487.1,19,458.9,19z M458.9,87
              c-9.4,0-17-7.6-17-17c0-9.4,7.6-17,17-17s17,7.6,17,17C475.9,79.4,468.3,87,458.9,87z"/>
            <g>
              <path d="M458.9,85.3c-8.4,0-15.3-6.8-15.3-15.3c0-8.4,6.8-15.3,15.3-15.3s15.3,6.8,15.3,15.3C474.1,78.4,467.3,85.3,458.9,85.3z"
                />
              <path className="st1" d="M458.9,57.3c7,0,12.8,5.7,12.8,12.8s-5.7,12.8-12.8,12.8s-12.8-5.7-12.8-12.8S451.8,57.3,458.9,57.3
                 M458.9,52.3c-9.8,0-17.8,8-17.8,17.8s8,17.8,17.8,17.8c9.8,0,17.8-8,17.8-17.8S468.7,52.3,458.9,52.3L458.9,52.3z"/>
            </g>
          </g>
        </SVGComponent>
      </div>
    )
  }
  componentDidMount() {
    if (!Store.Detector.isMobile) {
      dom.event.on(this.refs.logo, 'mouseenter', this.onMouseEnter)
      dom.event.on(this.refs.logo, 'mouseleave', this.onMouseLeave)
    }
    this.setup()
  }
  setup() {
    this.logoAnimHover = new TimelineMax()
    this.logoAnimHover.fromTo(this.refs['letter-v'], 1, { x: -400, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimHover.fromTo(this.refs['letter-o_1'], 1, { x: -306, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimHover.fromTo(this.refs['letter-l'], 1, { x: -204, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, rotation: -360, ease: Expo.easeInOut}, 0)
    this.logoAnimHover.fromTo(this.refs['letter-o_2'], 1, { x: -102, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimHover.fromTo(this.refs['letter-t'], 1, { x: 100, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimHover.fromTo(this.refs['letter-i'], 1, { x: 167, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, rotation: -360, ease: Expo.easeInOut}, 0)
    this.logoAnimHover.fromTo(this.refs['letter-e'], 1, { x: 234, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimHover.fromTo(this.refs['letter-r'], 1, { x: 336, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, rotation: -360, ease: Expo.easeInOut}, 0)
    this.logoAnimHover.fromTo(this.refs['letter-s'], 1, { x: 439, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimHover.pause(0)
    this.logoAnimAbout = new TimelineMax()
    this.logoAnimAbout.fromTo(this.refs['letter-v'], 1, { x: -400, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimAbout.fromTo(this.refs['letter-o_1'], 1, { x: -306, rotation: 0, transformOrigin: '50% 50%' }, { x: 102, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimAbout.fromTo(this.refs['letter-l'], 1, { x: -204, y: 0, rotation: 0, transformOrigin: '50% 50%' }, { x: -102, y: 102, rotation: -360, ease: Expo.easeInOut}, 0)
    this.logoAnimAbout.fromTo(this.refs['letter-o_2'], 1, { x: -102, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, y: 102, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimAbout.fromTo(this.refs['letter-n'], 1, { x: 0, rotation: 0, transformOrigin: '50% 50%' }, { x: 102, y: 102, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimAbout.fromTo(this.refs['letter-t'], 1, { x: 100, y: 0, rotation: 0, transformOrigin: '50% 50%' }, { x: -71, y: 204, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimAbout.fromTo(this.refs['letter-i'], 1, { x: 167, y: 0, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, y: 204, rotation: -360, ease: Expo.easeInOut}, 0)
    this.logoAnimAbout.fromTo(this.refs['letter-e'], 1, { x: 234, y: 0, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, y: 306, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimAbout.fromTo(this.refs['letter-r'], 1, { x: 336, y: 0, rotation: 0, transformOrigin: '50% 50%' }, { x: 102, y: 306, rotation: -360, ease: Expo.easeInOut}, 0)
    this.logoAnimAbout.fromTo(this.refs['letter-s'], 1, { x: 439, y: 0, rotation: 0, transformOrigin: '50% 50%' }, { x: 0, y: 408, rotation: 360, ease: Expo.easeInOut}, 0)
    this.logoAnimAbout.pause(0)
  }
  onLogoClick() {
    Router.setRoute(Store.defaultRoute())
  }
  show() {
    dom.classes.add(this.refs.logo, 'show')
  }
  onMouseEnter(e) {
    if (e) e.preventDefault()
    if (this.about) return
    this.logoAnimHover.timeScale(1.4).play()
  }
  onMouseLeave(e) {
    if (e) e.preventDefault()
    if (this.about) return
    this.logoAnimHover.timeScale(1.4).reverse()
  }
  playAboutAnim() {
    if (this.about) {
      this.about = false
      this.logoAnimAbout.timeScale(1.8).reverse()
    } else {
      this.about = true
      this.logoAnimAbout.timeScale(1.4).play()
    }
  }
  toggleOutAnim() {
    if (this.about) {
      this.about = false
      this.logoAnimAbout.timeScale(1.8).reverse()
    }
  }
  componentWillUnmount() {
    if (!Store.Detector.isMobile) {
      dom.event.off(this.refs.logo, 'mouseenter', this.onMouseEnter)
      dom.event.off(this.refs.logo, 'mouseleave', this.onMouseLeave)
    }
  }
}

export default Logo
