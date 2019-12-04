import fs from 'fs'
import flatten from 'array-flatten'
import fileExtension from 'file-extension'
import parse from './content-parser'
import encode from './content-encoder'

export const writeFile = (path, data) => {
  fs.writeFileSync(path, encode(fileExtension(path), data))
}

export const createDirectory = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

export const readFile = (path) => {
  const content = fs.readFileSync(path, 'utf8')
  return parse(fileExtension(path), content)
}

export const getFileNames = (directory) => {
  createDirectory(directory)
  return flatten(
    fs.readdirSync(directory)
      .filter(name => name[0] !== '.')
      .map(name => {
        const location = `${directory}/${name}`
        if (fs.lstatSync(location).isDirectory()) {
          return getFileNames(location)
        }

        return location
      })
  )
}

export const readAllFiles = (path, format) => {
  const result = []
  const names = getFileNames(path)

  for (let name of names) {
    if (!format || fileExtension(name) === format) {
      const file = readFile(name)
      if (file) {
        result.push(file)
      }
    }
  }

  return result
}
