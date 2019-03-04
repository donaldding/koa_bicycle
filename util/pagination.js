function pagination (count, perPage = 20) {
  if (count >= 20) {
    let page = Math.ceil(count / perPage)
    return page
  } else {
    let page = 1
    return page
  }
}

module.exports = pagination
