function getUserInfo (user) {
  return {
    username: user.username,
    id: user.id || user._id
  }
}

module.exports = getUserInfo
