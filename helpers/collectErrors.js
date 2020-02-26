const collectErrors = data => {
  return {
    validationErrors: data.details.map(detail => {
      return {
        "field": detail.context.key,
        "message": detail.message
      }
    })
  }
}

const customErrors = data => {
  return {
    validationErrors: customErrors.map(error => {
      return {
        "field": error.field,
        "message": error.message
      }
    })
  }
}

module.exports = { collectErrors, customErrors };