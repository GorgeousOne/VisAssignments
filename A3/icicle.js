import * as d3 from "d3";
import { bigMoneyFormat, shortenText } from "./src/utils.js";

export function icicle({
  svg,
  data,
  width = 1000,
  height = 600,
  color
}) {

  // define a hierarchy for the data
  // const hierarchy =


  // define a partition layout as the root of the hierarchy
  // const root =

  // compute the maximum depth of hierarchy from the root node
  // const maxDepth =

  // define a scale for the depth of the hierarchy
  // const scaleX =

  // setup the viewBox and font for the SVG
  svg.attr("viewBox", [0, 0, width, height]).attr("font-family", "sans-serif");

  // setup a group node for each node in the hierarchy
  const node = svg
    .selectAll("g")
    .data(root.descendants().filter((d) => d.depth > 0))
    .join("g")
    .attr("transform", (d) => `translate(${scaleX(d.depth)},${d.x0})`);

  // create a rectangle for each node

  const minFontSize = 6;

  // helper function to compute font size according to the size of the rectangle
  function fontSize(d) {
    return Math.min(12, Math.max(minFontSize, d.x1 - d.x0 - 2));
  }

  // setup text labels for each node
  // const text =

  // create text labels for each node


  return svg.node();
}
