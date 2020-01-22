import { ChangeEvent } from '@navarik/storage'

export interface Partitioner {
  getPartitionKey(event: ChangeEvent): string
}

export interface Formatter {
  fileExtension: string
  format(event: ChangeEvent): string
  parse(chunk: string): ChangeEvent
}
