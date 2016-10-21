import is from 'is'

function getAllMethods(obj) {
  return Object.getOwnPropertyNames(obj)
		.filter(key => is.fn(obj[key]))
}

function autoBind(obj) {
  getAllMethods(obj.constructor.prototype).forEach(mtd => {
    obj[mtd] = obj[mtd].bind(obj)
  })
}

export default autoBind
