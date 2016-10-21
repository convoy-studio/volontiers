import Store from '../../store'
import { initGlobalEvents } from '../../services/global-events'
import FrontContainer from '../../components/FrontContainer'
import PagesContainer from '../../components/PagesContainer'

export default class AppTemplate extends React.Component {
  render() {
    return (
    	<div id='app-template'>
    		<FrontContainer />
    		<PagesContainer />
    	</div>
    )
  }
}
