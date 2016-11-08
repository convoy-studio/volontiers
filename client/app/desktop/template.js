import Store from '../../store'
import Constants from '../../constants'
import Actions from '../../actions'
import { initGlobalEvents, resize as globalResize } from '../../services/global-events'
import FrontContainer from '../../components/FrontContainer'
import PagesContainer from '../../components/PagesContainer'
import CanvasContainer from '../../components/CanvasContainer'

export default class AppTemplate extends React.Component {
  componentWillMount() {
    this.update = this.update.bind(this)
    this.resize = this.resize.bind(this)
  }
  render() {
    return (
      <div id='app-template'>
        <FrontContainer ref='front-container' />
        <PagesContainer ref='pages-container' />
        <CanvasContainer ref='canvas-container' />
      </div>
    )
  }
  componentDidMount() {
    Store.on(Constants.WINDOW_RESIZE, this.resize)
    TweenMax.ticker.addEventListener('tick', this.update)
    globalResize() // before render the app call the resize action to fill the initial values (Mouse, WindowSize)
  }
  update() {
    this.refs['pages-container'].update()
    this.refs['canvas-container'].update()
    this.refs['front-container'].update()
  }
  resize() {
    this.refs['pages-container'].resize()
    this.refs['canvas-container'].resize()
    this.refs['front-container'].resize()
  }
}
