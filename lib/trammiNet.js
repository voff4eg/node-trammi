/*jslint node:true, sloppy:true, nomen: true, unparam:true */


// Borrowed by https://bitbucket.org/wyatt/dijkstra.js

var fs = require('fs'),
    util = require('util'),
    net = require('./trammiDBNet').net;

var PriorityQueue = {
    make: function (options) {
        var T = PriorityQueue, t = {}, opts = options || {}, key;

        for (key in T) {
            if (T.hasOwnProperty(key)) {
                t[key] = T[key];
            }
        }

        t.queue = [];
        t.sorter = opts.sorter || T.default_sorter;

        return t;
    },

    default_sorter: function (a, b) {
        return a.cost - b.cost;
    },

    push: function (value, cost) {
        var item = {value: value, cost: cost};

        this.queue.push(item);
        this.queue.sort(this.sorter);
    },

    pop: function () {
        return this.queue.shift();
    }
};

function single_source_shortest_paths(graph, s, d) {
    var predecessors = {},
        costs = {},
        open,
        closest,
        u,
        cost_of_s_to_u,
        adjacent_nodes,
        cost_of_e,
        cost_of_s_to_u_plus_cost_of_e,
        cost_of_s_to_v,
        first_visit,
        v,
        i,
        n,
        msg;

    costs[s] = 0;

    open = PriorityQueue.make();
    open.push(s, 0);

    while (open) {
        closest = open.pop();
        u = closest.value;
        cost_of_s_to_u = closest.cost;

        adjacent_nodes = graph[u] || [];

        n = adjacent_nodes.length;
        for (i = 0; i < n; i += 1) {
            v = adjacent_nodes[i].to;
            cost_of_e = adjacent_nodes[i].d || 1;

            cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

            cost_of_s_to_v = costs[v];
            first_visit = (typeof costs[v] === 'undefined');
            if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
            }

            if (v === d) {
                open = null;
                break;
            }
        }
    }

    if (typeof costs[d] === 'undefined') {
        msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
        throw new Error(msg);
    }

    return predecessors;
}

function extract_shortest_path_from_predecessor_list(predecessors, d) {
    var nodes = [], u = d, predecessor;

    while (u) {
        nodes.push(u);
        predecessor = predecessors[u];
        u = predecessors[u];
    }
    nodes.reverse();

    return nodes;
}

function findPath(s, d) {
    var predecessors, path, i, n, tos, j, m, ns, p = [];

    predecessors = single_source_shortest_paths(net, s, d);
    path = extract_shortest_path_from_predecessor_list(predecessors, d);

    ns = path[1];
    tos = net[path[0]];
    m = tos.length;
    for (j = 0; j < m; j += 1) {
        if (tos[j].d === 1 && ns === tos[j].to) {
            p.push({
                scode: path[0],
                sline: tos[j].l
            });
        }
    }

    n = path.length;
    for (i = 1; i < n; i += 1) {
        tos = net[path[i]];
        m = tos.length;
        for (j = 0; j < m; j += 1) {
            if (tos[j].d === 1) {
                p.push({
                    scode: path[i],
                    sline: tos[j].l
                });
            }
        }
    }

    return p;
}
exports.findPath = findPath;


