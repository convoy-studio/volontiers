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
  		<div id='front-container' ref='front-container'>
  			<header id="header">
  				<ul>
  					{menuItems}
  				</ul>
  			</header>
  		</div>
  	)
  }
  didPageChange() {
  	// Update or highlight parts of interface depends the route
  }
}
