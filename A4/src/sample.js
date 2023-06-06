import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
const width = 250;
const height = 70;
const padding = 8;
const data = {
    "name": "A1",
    "children": [{
        "name": "B1",
        "children": [{
            "name": "C1",
            "value": 100
        }, {
            "name": "C2",
            "value": 300
        }, {
            "name": "C3",
            "value": 200
        }]
    }, {
        "name": "B2",
        "value": 200
    }]
};

const treeLayout = d3.tree().size([100, 50])
const root = d3.hierarchy(data).sum(d => d.value).sort((a, b) => b.height - a.height || b.value - a.value)

console.log(root.descendants())

const svg = d3.select('#sample').attr("viewBox", [0, 0, width, height])
treeLayout(root)

// Nodes
svg.append('g')
    .selectAll('circle.sampletree')
    .data(root.descendants())
    .join('circle')
    .style('fill', 'steelblue').style('stroke', 'none')
    .attr('cx', d => d.x + width / 4)
    .attr('cy', d => d.y + padding)
    .attr('r', 3)
    .classed('sampletree', true)

// Links
svg.append('g')
    .selectAll('line.sampletree')
    .data(root.links())
    .join('line')
    .style('fill', 'none').style('stroke', '#ccc')
    .attr('x1', d => d.source.x + width / 4)
    .attr('y1', d => d.source.y + padding)
    .attr('x2', d => d.target.x + width / 4)
    .attr('y2', d => d.target.y + padding)
    .classed('sampletree', true)

// Labels
svg.append('g')
    .selectAll('text.sampletree')
    .data(root.descendants())
    .join('text')
    .attr('x', d => d.x + width / 4 + padding)
    .attr('y', d => d.y + padding)
    .attr('dy', '0.1em')
    .attr('text-anchor', "left")
    .attr('font-size', 5)
    .text(d => {
        return d.data.name + ": " + d.value
    }).classed('sampletree', true)

