const encoders = {
  json: content => JSON.stringify(content)
}

const encode = (type, content) => {
  if (!encoders[type]) {
    throw new Error(`Unknown file type: ${type}`)
  }

  return encoders[type](content)
}

export default encode
