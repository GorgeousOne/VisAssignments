import * as d3 from "d3";
import { bigMoneyFormat, shortenText } from "./src/utils.js";

export function icicle({
  svg,
  data,
  width = 1000,
  height = 600,
  color
}) {
  // define a root for the data
  const root = d3.hierarchy(data).sum(entry => entry.revenue);

  // define a partition layout as the root of the root
  const layout = d3.partition()
      .size([width, height])
      .padding(1);
  layout(root);

  // compute the maximum depth of root from the root node
  // const maxDepth =

  // define a scale for the depth of the root
  // const scaleX =

  // setup the viewBox and font for the SVG
  svg.attr("viewBox", [0, 0, width, height]).attr("font-family", "sans-serif");

  // setup a group node for each node in the root
  const node = svg
      .selectAll("g")
      .data(root.descendants().filter((d) => d.depth > 0))
      .join("g")
      .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  // create a rectangle for each node
  const rect = node.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0) //d.x1 - d.x0 - 1
      .attr("fill-opacity", 0.2);

  const minFontSize = 4;

  // helper function to compute font size according to the size of the rectangle
  function fontSize(d) {
    return Math.min(12, Math.max(minFontSize, d.x1 - d.x0 - 2));
  }

  const formatText = data => {
    let name = data.data.name !== undefined ? data.data.name : "";
    return `${shortenText(name, 15)} ${bigMoneyFormat(data.value)}`
  }

  // setup text labels for each node
  // create text labels for each node
  const text = node.append("text")
      .filter(d => fontSize(d) >= minFontSize)
      .attr("x", 4)
      .attr("y", 13)
      .text(d => formatText(d))
      .style("font-size", d => `${fontSize(d)}px`)

  text.attr("transform", "rotate(90) translate(0, -20)")

  return svg.node();
}
