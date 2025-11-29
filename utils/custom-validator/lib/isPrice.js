const isPrice = (input) => {
  return /^\d+(\.\d{1,2})?$/.test(input)
}

module.exports = {
  isPrice
}
