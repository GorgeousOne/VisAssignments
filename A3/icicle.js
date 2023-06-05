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
      .size([height, width])
      .padding(1);
  layout(root);

  // compute the maximum depth of root from the root node
  const maxDepth = d3.max(root.descendants(), d => d.depth);

  // define a scale for the depth of the root
  const scaleX = d3.scaleLinear()
      .domain([1, maxDepth + 1])
      .range([0, width])

  // setup the viewBox and font for the SVG
  svg.attr("viewBox", [0, 0, width, height]).attr("font-family", "sans-serif");

  // setup a group node for each node in the root
  const node = svg
      .selectAll("g")
      .data(root.descendants().filter((d) => d.depth > 0))
      .join("g")
      .attr("transform", (d) => `translate(${scaleX(d.depth)}, ${d.x0})`);

  // create a rectangle for each node
  const rect = node.append("rect")
      //recalculate width
      .attr("width", width / maxDepth)
      .attr("height", d => d.x1 - d.x0)
      .attr("fill", d => {
        //copy color from parent
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      //add decreasing opacity
      .attr("fill-opacity", d => Math.pow(0.6, d.depth));

  const minFontSize = 4;

  // helper function to compute font size according to the size of the rectangle
  function fontSize(d) {
    return Math.min(12, Math.max(minFontSize, d.x1 - d.x0 - 2));
  }

  // create string with formatted name and gross for a franchise
  const formatText = d => {
    //select franchise name or movie title
    let name = d.data.name ? d.data.name : d.data.title;
    return `${shortenText(name)} ${bigMoneyFormat(d.value)}`
  }

  // setup text labels for each node
  // create text labels for each node
  const text = node
      //filter to small text away
      .filter(d => fontSize(d) > minFontSize)
      .append("text")
      .attr("x", 4)
      .attr("y", d => fontSize(d))
      .text(d => formatText(d))
      .style("font-size", d => `${fontSize(d)}px`)

  return svg.node();
}
