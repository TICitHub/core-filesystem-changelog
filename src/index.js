import { readAllFiles, writeFile, createDirectory } from './filesystem'

class FilesystemChangelogAdapter {
  constructor(config) {
    this.workingDirectory = config.workingDirectory
    this.format = config.format
    this.readOnly = config.readOnly !== undefined ? config.readOnly : true
    this.listener = () => {}
  }

  observe(handler) {
    this.listener = handler
  }

  write(data) {
    if (this.readOnly) {
      throw new Error('[FilesystemChangelogAdapter] This adapter is read-only')
    }

    createDirectory(`${this.workingDirectory}/${data.type}/${data.id}`)
    writeFile(`${this.workingDirectory}/${data.type}/${data.id}/${data.version_id}.${this.format}`, data)

    return this.listener(data)
  }

  async init(types, signatureProvider) {
    for (let type of types) {
      const log = readAllFiles(`${this.workingDirectory}/${type}`, this.format)
      for (let data of log) {
        const record = data.id ? data : signatureProvider.signNew(type, data)
        await this.listener(record)
      }
    }
  }

  isConnected() {
    return true
  }
}

export default FilesystemChangelogAdapter
