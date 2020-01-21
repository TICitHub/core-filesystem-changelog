import { ChangeEvent } from '@navarik/storage'

export interface Partitioner {
  getPartition(event: ChangeEvent): string
}

export interface Formatter {
  fileExtension: string
  format(event: ChangeEvent): string
  parse(chunk: string): ChangeEvent
}
