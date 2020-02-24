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

module.exports = collectErrors;