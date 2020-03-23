module.exports = {
  checkBody: async (req, res, next) => {
    try {
      const { body } = req
      const dataToBeUpdated = []
      for (const obj in body) {
        if (dataToBeUpdated.indexOf(obj) === -1) {
          dataToBeUpdated.push(obj)
        }
      }
      req.locals = dataToBeUpdated
      next();
    }
    catch (error){
      res.status(500).json({ error })
    }
  }
}
