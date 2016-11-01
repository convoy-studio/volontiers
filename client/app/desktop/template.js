import Store from '../../store'
import { initGlobalEvents, resize } from '../../services/global-events'
import FrontContainer from '../../components/FrontContainer'
import PagesContainer from '../../components/PagesContainer'

export default class AppTemplate extends React.Component {
  componentWillMount() {
    this.update = this.update.bind(this)
    resize() // before render the app call the resize action to fill the initial values (Mouse, WindowSize)
  }
  render() {
    return (
      <div id='app-template'>
        <FrontContainer />
        <PagesContainer ref='pages-container' />
      </div>
    )
  }
  componentDidMount() {
    TweenMax.ticker.addEventListener('tick', this.update)
  }
  update() {
    this.refs['pages-container'].update()
  }
}
