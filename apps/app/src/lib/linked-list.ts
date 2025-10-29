export class LinkedListNode<T> {
  private readonly _value: T;
  private _next: LinkedListNode<T> | null;

  constructor(value: T) {
    this._value = value;
    this._next = null;
  }

  set next(node: LinkedListNode<T> | null) {
    this._next = node;
  }

  get next() {
    return this._next;
  }

  get value() {
    return this._value;
  }
}

export class LinkedList<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private _length = 0;

  getHead() {
    return this.head;
  }

  get length() {
    return this._length;
  }

  append(value: T) {
    const newNode = new LinkedListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this._length++;
  }
}
