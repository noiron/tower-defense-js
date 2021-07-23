export class Graph {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.walls = []; // 障碍物
  }

  /**
   * @param {*} node: [x, y]
   */
  inBounds(node) {
    return (
      0 <= node[0] &&
      node[0] < this.width &&
      0 <= node[1] &&
      node[1] < this.height
    );
  }

  /**
   * 检查给定的一个点是否上有障碍物
   * 即给定点的坐标与障碍物数组中的任意元素坐标均不等
   */
  passable(node) {
    const walls = this.walls;
    return walls.every((wall) => {
      return wall[0] !== node[0] || wall[1] !== node[1];
    });
  }

  neighbors(node) {
    const [x, y] = node;
    let results = [
      [x + 1, y],
      [x, y - 1],
      [x - 1, y],
      [x, y + 1],
    ];
    results = results.filter(this.passable, this);
    results = results.filter(this.inBounds, this);
    return results;
  }

  /**
   * 输出 Graph 的信息
   * 障碍物所在处标记为'#'，可通过区域标记为'.'
   */
  print() {
    let info = '';
    for (let j = 0; j < this.height; j++) {
      for (let i = 0; i < this.width; i++) {
        if (hasNode.call(this.walls, [i, j])) {
          info += '#';
        } else {
          info += '.';
        }
      }
      info += '\n';
    }
    console.log(info);
  }
}

class Queue {
  constructor() {
    this.elements = [];
  }

  empty() {
    return this.elements.length === 0;
  }

  put(x) {
    this.elements.push(x);
  }

  get() {
    return this.elements.shift();
  }
}

export class BreadthFirstSearch {
  // 寻找graph上任一点到start的路径
  constructor(graph, start) {
    this.graph = graph;
    this.width = graph.width;
    this.height = graph.height;
    this.start = start;

    const frontier = new Queue();
    frontier.put(start);

    const visited = [start];

    this.cameFrom = [];
    this.distance = [];
    for (let i = 0; i < this.width; i++) {
      this.cameFrom[i] = [];
      this.distance[i] = [];
      for (let j = 0; j < this.height; j++) {
        this.cameFrom[i][j] = null;
        this.distance[i][j] = -1;
      }
    }

    let current;
    let curNeighbors = [];

    while (!frontier.empty()) {
      current = frontier.get();

      curNeighbors = graph.neighbors(current);
      curNeighbors.forEach((next) => {
        if (!hasNode.call(visited, next)) {
          frontier.put(next);
          visited.push(next);
          const [x, y] = next;
          this.cameFrom[x][y] = current;
          this.distance[x][y] = this.distance[current[0]][current[1]] + 1;
        }
      });
    }
  }

  showPath() {
    let info = '';
    for (let j = 0; j < this.height; j++) {
      for (let i = 0; i < this.width; i++) {
        if (hasNode.call(this.graph.walls, [i, j])) {
          info += '#\t\t';
        } else {
          info += this.cameFrom[i][j] + '\t\t';
        }
      }
      info += '\n';
    }
    console.log(info);
  }

  showDistance() {
    let info = '';
    for (let j = 0; j < this.height; j++) {
      for (let i = 0; i < this.width; i++) {
        if (hasNode.call(this.graph.walls, [i, j])) {
          info += '#\t';
        } else {
          info += this.distance[i][j] + '\t';
        }
      }
      info += '\n';
    }
    console.log(info);
  }

  /**
   * 最后生成的路径数组中，node为第一个元素，this.start为最后一个元素
   */
  findPath(node) {
    const path = [];
    let [curX, curY] = node;
    // 如果需要查询的 node 恰等于 start，则将 start 返回
    if (curX === this.start[0] && curY === this.start[1]) {
      return [[curX, curY]];
    }
    if (this.cameFrom[curX][curY] === null) {
      return [];
    }
    path.push(node);
    while (curX !== this.start[0] || curY !== this.start[1]) {
      const [x, y] = this.cameFrom[curX][curY];
      path.push([x, y]);
      curX = x;
      curY = y;
    }
    return path;
  }
}

/**
 * 用于检查一个数组中是否存在 arr
 * @param {array} node 是一个形如 [x, y] 的数组
 * 调用：hasNode.call(array, node)
 */
function hasNode(node) {
  return this.some((item) => item[0] === node[0] && item[1] === node[1]);
}

function removeNode(node) {
  const index = this.find((item) => item[0] === node[0] && item[1] === node[1]);
  if (index >= 0) {
    this.splice(index, 1);
    return true;
  }
  return false;
}

// const g = new Graph(10, 10);
// var walls = [[1, 7], [1, 8], [2, 7], [2, 8], [3, 7], [3, 8], [0,0],[6,2], [6,3], [6,4]];
// for (var i = 0; i < walls.length; i++) {
//     g.walls.push(walls[i]);
// }
// g.print();

// var bfs = new BreadthFirstSearch(g, [5,8]);
// bfs.showDistance();
// bfs.showPath();
// var path11 = bfs.findPath([1,1]);
// console.log(path11);
