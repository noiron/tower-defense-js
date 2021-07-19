/**
 * 用于保存游戏中的各种 entity 的容器对象
 * 例如 enemy, tower, bullet
 * 提供增、删功能
 */

class EntityCollection extends Array {
  constructor() {
    super();
  }

  getElementById(id) {
    for (let i = 0; i < this.length; i++) {
      if (this[i].id === id) {
        return this[i];
      }
    }
    return null;
  }

  removeElementById(id) {
    let removed;
    for (let i = 0; i < this.length; i++) {
      if (this[i].id === id) {
        removed = this.splice(i, 1);
        break;
      }
    }
    return removed;
  }

  removeElementByIndex(idx) {
    const removed = this.splice(idx, 1);
    return removed;
  }
}

export default EntityCollection;
