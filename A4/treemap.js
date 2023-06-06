import * as d3 from "d3";
import { bigMoneyFormat, shortenText } from "./src/utils.js";

export function treemap({
  svg,
  data,
  width = 1000,
  height = 600,
  color,
}) {
  svg.attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif");
  svg.selectAll("*").remove();

  // Task 3: prepare the treemap using d3.treemap and d3.hierarchy with the
  // Slice and Dice tiling algorithm.


  // INSERT YOUR CODE HERE
  const root = d3.hierarchy(data).sum(entry => entry.revenue);
  d3.treemap()
      .size([width, height])
      .padding(2)
      .tile(d3.treemapSliceDice)
      (root);
  // END OF YOUR CODE

  draw();

  // Finish the draw function. You can take inspiration (and code) from
  // the given icicles implementation for both the rectangles and the labels.
  function draw() {
    // simple check if we have a root variable; return without drawing if not
    if (typeof (root) === "undefined") return;

    // create a group for each leaf node
    const leaf = svg.selectAll("g") // Select the group elements instead of rectangles
        .data(root.leaves())
        .join("g")
        .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

    // actually draw the rectangles
    leaf.append("rect")
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .style("fill", d => {
          // Copy color from parent
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        })
        .attr("fill-opacity", 0.8);

    // setup labels for rectangles that are big enough
    // add the name and the value as labels
    leaf.append("text")
        .text(d => d.data.title)
        .style("font-size", d => `${fontSize(d)}px`)
        .attr("transform", "rotate(90) translate(5, -5)");
  }
}

// naive function to heuristically determine font size based on the rectangle size
function fontSize(d) {
  return Math.min(12, Math.max(8, d.x1 - d.x0 - 4));
}

