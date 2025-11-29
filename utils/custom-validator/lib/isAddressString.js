const isAddressString = (input) => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ0-9'\-.+:,#()&/ ]+$/.test(input.trim())
}

module.exports = {
  isAddressString
}
