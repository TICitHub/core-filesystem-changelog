import { Formatter } from "./types"

export class JsonlogFormatter implements Formatter {
  fileExtension: string = 'jsonlog'

  format(event) {
    return JSON.stringify(event)
  }

  parse(string) {
    return JSON.parse(string)
  }
}