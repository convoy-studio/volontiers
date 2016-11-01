import BaseComponent from '../pager/components/BaseComponent'
import Store from '../store'
import Constants from '../constants'
import LangButton from './partials/LangButton'
import SVGComponent from './SVGComponent'

export default class FrontContainer extends BaseComponent {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    Store.on(Constants.ROUTE_CHANGED, this.didPageChange)
  }
  render() {
    return (
      <header id='front-container' ref='front-container' className="navigation">
        <a href="#" className="link">Projects</a>
        <a href="home" className="navigation__center">
          <SVGComponent width='100%' viewBox="0 0 13 13">
            <polygon fillRule="evenodd" clipRule="evenodd" points="0.25,0.25 12.75,0.25 8.667,12.75 4.412,12.75"/>
          </SVGComponent>
        </a>
        <div className="navigation__right">
          <ul>
            <li>
              <LangButton lang="en"/>
            </li>
            <li className="navigation__spacer">—</li>
            <li>
              <LangButton lang="fr"/>
            </li>
            <li>
              <a href="/about" className="link">About</a>
            </li>
          </ul>
        </div>
      </header>
    )
  }
  didPageChange() {
    // Update or highlight parts of interface depends the route
  }
}
