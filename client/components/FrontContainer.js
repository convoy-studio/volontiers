import BaseComponent from '../pager/components/BaseComponent'
import Store from '../store'
import Constants from '../constants'

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
              <a href="#" className="link">EN</a>
            </li>
            <li className="navigation__spacer">—</li>
            <li>
              <a href="#" className="link">FR</a>
            </li>
            <li>
              <a href="#" className="link">About</a>
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
