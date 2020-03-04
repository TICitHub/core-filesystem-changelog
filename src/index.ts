import fs from 'fs'
import readline from 'readline'
import { PassThrough } from "stream"
import { Changelog, Observer, ChangeEvent } from '@navarik/storage'
import { Map } from '@navarik/types'
import { Partitioner, Formatter } from './types'
import { DefaultPartitioner } from './default-partitioner'
import { JsonlogFormatter } from './jsonlog-formatter'

export * from "./types"

type FilesystemChangelogConfig = {
  workingDirectory: string
  formater?: Formatter
  partitioner?: Partitioner
}

function readLines(input) {
  const output = new PassThrough({ objectMode: true })
  const rl = readline.createInterface({ input })
  rl.on("line", line => { output.write(line) })
  rl.on("close", () => { output.push(null) })

  return output
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
    const partition = this.partitioner.getPartitionKey(event)
    const extension = this.formater.fileExtension
    const fileName = `${this.workingDirectory}/${partition}.${extension}`

    this.getFileStream(fileName).write(this.formater.format(event)+ "\n")

    await this.onEvent(event)
  }

  async reset() {
    const files = fs.readdirSync(this.workingDirectory)
    const completes = files.map(async (file) => {
      const stream = fs.createReadStream(`${this.workingDirectory}/${file}`)
      for await (const line of readLines(stream)) {
        await this.onEvent(this.formater.parse(line))
      }
    })

    await Promise.all(completes)
  }
}
