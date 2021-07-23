class globalId {
  value: Array<number>;

  constructor() {
    this.value = [];
  }

  genId() {
    if (this.getLength() === 0) {
      this.value.push(0);
      return 0;
    } else {
      const id = this.value[this.getLength() - 1] + 1;
      this.value.push(id);
      return id;
    }
  }

  getLength() {
    return this.value.length;
  }

  clear() {
    this.value = [];
  }
}

export default new globalId();
