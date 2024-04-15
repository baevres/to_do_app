const requestFunc = (submitFunc, errorFunc) => {
  createBoard({ title })
    .then((boards) => {
      const newBoard = boards.content[0]
      setUserBoards((userBoards) => [...userBoards, newBoard])
    })
    .catch((err) => {
      errorFunc(err.message)
    })
}

export default requestFunc
