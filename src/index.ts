import { ChangeLog } from "@navarik/core"
import { FilesystemEventLog } from "./filesystem-event-log"
import { FilesystemChangelogConfig } from "./types"

export class FilesystemChangeLog implements ChangeLog {
  private config: Partial<FilesystemChangelogConfig<any>>

  constructor(config: FilesystemChangelogConfig<any>) {
    this.config = config
  }

  getStream<T>(name: string) {
    return new FilesystemEventLog<T>({
      workingDirectory: this.config.workingDirectory,
      topic: name,
      logger: this.config.logger,
      formatter: this.config.formatter,
      partitioner: this.config.partitioner
    })
  }
}
