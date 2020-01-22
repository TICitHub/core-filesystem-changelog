import { Partitioner } from "./types";

export class DefaultPartitioner implements Partitioner {
  getPartitionKey() {
    // Send all events to the same partition
    return 'changelog'
  }
}