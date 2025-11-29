const isBranchName = (input) => {
  return /^[a-zA-Z0-9 -+,@.'&-]+$/.test(input.trim())
}

module.exports = {
  isBranchName
}
