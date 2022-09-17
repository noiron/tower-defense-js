const BFS = require('../src/utils/BreadthFirstSearch');
const expect = require('chai').expect;

describe('Breadth first search', function() {
  // 生成一个 Graph
  const g = new BFS.Graph(5, 5);
  const start = [0, 0];
  // 加入预设障碍
  const walls = [[0, 1], [1, 1], [2, 1], [1, 3], [2, 3]];
  walls.forEach(wall => g.walls.push(wall));
  // 利用BFS搜索图中各点至start的路径
  const bfs = new BFS.BreadthFirstSearch(g, start);
  // 展示从 [0, 4] -> [0, 0] 的路径
  const path1 = bfs.findPath([0, 4]);

  it('Graph\'s walls\' length should equal array length', function() {
    expect(g.walls.length).to.be.equal(walls.length);
  });
  it('Path start from [0, 4], end with [0, 0], length = 11', function() {
    expect(path1[0]).deep.equal([0, 4]);
    expect(path1[path1.length - 1]).deep.equal(start);
    expect(path1.length).equal(11);
  });
  it('Path from start point itself', function() {
    const pathStart = bfs.findPath([start[0], start[1]]);
    expect(pathStart[0]).deep.equal(start);
    expect(pathStart.length).eq(1);
  });

});
