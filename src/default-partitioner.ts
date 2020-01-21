import { Partitioner } from "./types";

export class DefaultPartitioner implements Partitioner {
  getPartition() {
    // Send all events to the same partition
    return 'changelog'
  }
}