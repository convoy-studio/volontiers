import Store from '../../store'
import slide from './Slide'

export default (container)=> {
  let scope
  const updateSlides = () => {
    const content = Store.getCurrentProject()
    const assets = content.assets
    assets.forEach((asset) => {
      console.log(asset)
    })
    console.log(content)
    removeSlides()
  }
  const removeSlides = () => {
    // const slds = container.children
    // slds.forEach((child) => {
    //   container.removeChild(child)
    //   child = null
    // })
    // console.log(container)
  }
  scope = {
    container,
    updateSlides,
    removeSlides,
    slides: []
  }
  return scope
}
