export class Queue<T> {
  private data: T[] = []

  public enqueue(...items: T[]) {
    this.data.push(...items)
  }

  public dequeue() {
    return this.data.shift()
  }

  public clear() {
    this.data = []
  }
}
