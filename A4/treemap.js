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
  // const root = ...


  // END OF YOUR CODE

  draw();

  // Finish the draw function. You can take inspiration (and code) from
  // the given icicles implementation for both the rectangles and the labels.
  function draw() {
    // simple check if we have a root variable; return without drawing if not
    if (typeof (root) === "undefined") return;

    // create a group for each leaf node
    // const leaf = ...


    // actually draw the rectangles
    // leaf ...

    // setup labels for rectangles that are big enough
    // const text = ...

    // add the name and the value as labels
    // text

  }
}

// naive function to heuristically determine font size based on the rectangle size
function fontSize(d) {
  return Math.min(12, Math.max(8, d.x1 - d.x0 - 4));
}

