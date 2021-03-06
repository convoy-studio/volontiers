if (!window.console) window.console = { log: () => {} }
import Store from './store'
import Utils from './utils/Utils'
import DesktopApp from './app/desktop'
import MobileApp from './app/mobile'
import MobileDetect from 'mobile-detect'
import dom from 'dom-hand'
const md = new MobileDetect(window.navigator.userAgent)
/* eslint no-extend-native: ["error", { "exceptions": ["Float32Array"] }]*/
if (!Float32Array.prototype.slice) {
  Float32Array.prototype.slice = Array.prototype.slice
}
Store.Detector.isSafari = (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)
Store.Detector.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1
Store.Detector.isMobile = (md.mobile() || md.tablet()) ? true : false
if ( Store.Detector.isMobile ) Store.ProjectsDelay = 2000
Store.Detector.pixelRatio = window.devicePixelRatio
Store.Parent = dom.select('#app-container')
Store.Detector.oldIE = dom.classes.contains(Store.Parent, 'ie6') || dom.classes.contains(Store.Parent, 'ie7') || dom.classes.contains(Store.Parent, 'ie8')
Store.Detector.isSupportWebGL = Utils.supportWebGL()
// if (Store.Detector.oldIE) Store.Detector.isMobile = true
let app
if ( Store.Detector.isMobile ) {
  dom.classes.add( dom.select('html'), 'mobile' )
  app = new MobileApp()
} else {
  app = new DesktopApp()
}


app.init()
