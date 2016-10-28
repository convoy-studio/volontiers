import BaseComponent from '../pager/components/BaseComponent'
import Store from '../store'
import Constants from '../constants'
import LangButton from './partials/LangButton'

export default class FrontContainer extends BaseComponent {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    Store.on(Constants.ROUTE_CHANGED, this.didPageChange)
  }
  render() {
    const menuData = Store.menuContent()
    const menuItems = Object.keys(menuData).map((key, index)=>{
      return (
    		<li key={index}><a href={key}>{menuData[key].name}</a></li>
    	)
    })
    return (
  		<header id='front-container' ref='front-container' className="navigation">
        <a href="#" className="link">Projects</a>
        <a href="home" className="navigation__center">
          <img src="http://placehold.it/16/16"/>
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
