import fs from 'fs'
import readline from 'readline'
import { Changelog, Observer, ChangeEvent } from '@navarik/storage'
import { Map } from '@navarik/types'
import { Partitioner, Formatter } from './types'
import { DefaultPartitioner } from './default-partitioner'
import { JsonlogFormatter } from './jsonlog-formatter'

type FilesystemChangelogConfig = {
  workingDirectory: string
  formater?: Formatter
  partitioner?: Partitioner
}

export class FilesystemChangelog implements Changelog {
  private workingDirectory: string
  private formater: Formatter
  private partitioner: Partitioner
  private observer: Observer|null
  private streams: Map<fs.WriteStream>

  constructor(config: FilesystemChangelogConfig) {
    this.formater = config.formater || new JsonlogFormatter()
    this.observer = null
    this.partitioner = config.partitioner || new DefaultPartitioner()
    this.workingDirectory = config.workingDirectory
    this.streams = {}
  }

  private getFileStream(name: string) {
    if (!this.streams[name]) {
      this.streams[name] = fs.createWriteStream(name, { flags: 'a' })
    }

    return this.streams[name]
  }

  async up() {
    if (!fs.existsSync(this.workingDirectory)) {
      fs.mkdirSync(this.workingDirectory, { recursive: true })
    }
  }

  async down() {
    for (const stream of Object.values(this.streams)) {
      stream.end()
    }
  }

  async isHealthy() {
    return true
  }

  observe(handler) {
    this.observer = handler
  }

  private async onEvent(event) {
    if (this.observer) {
      await this.observer(event)
    }
  }

  async write(event: ChangeEvent) {
    const partition = this.partitioner.getPartition(event)
    const extension = this.formater.fileExtension
    const fileName = `${this.workingDirectory}/${partition}.${extension}`

    this.getFileStream(fileName).write(this.formater.format(event)+ "\n")

    await this.onEvent(event)
  }

  async reset() {
    const files = fs.readdirSync(this.workingDirectory)
    const completes = files.map((file) => new Promise((resolve) => {
      const stream = fs.createReadStream(`${this.workingDirectory}/${file}`)
      const reader = readline.createInterface(stream)
      reader.on('line', line => this.onEvent(this.formater.parse(line)))
      reader.on('close', resolve)
    }))

    await Promise.all(completes)
  }
}
