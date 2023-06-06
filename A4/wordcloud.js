import * as d3 from "d3";
import cloud from "d3-cloud";
/* Function to draw a word cloud
 * svg: d3 selection of an svg element
 * wordsPerGenre: Map of form {group =>  [[word, frequency], [word, frequency], ...], ...}
 * selection: d3 selection of select element
 */
export function wordcloud({ svg, wordsPerGroup, selection }) {
  const width = 600;
  const height = 400;
  svg.attr("viewBox", [0, 0, width, height]);

  // group element, translated such that the origin is in the middle of the svg
  const g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // word size scale, you can play around with the range if you like
  const size = d3.scaleLinear().range([10, 50]);
  const opacity = d3.scaleLinear()
      .domain(size.range())
      .range([0.25, 1]);

  // fill the select box with the options from the wordsPerGroup
  selection
    .selectAll("option")
    .data(Array.from(wordsPerGroup.keys()))
    .join("option")
    .text((d) => d);

  // start of TODO: create the layout of the word cloud with
  // d3-cloud. The function you need has been imported for you
  // as "cloud()". Note, that the actual words will be
  // determined in the "update()"-function below.
  // The layout should call the "draw()"-function on "end".
  const layout = cloud()
      .size([width, height]) // Specify the size of the word cloud layout
      .rotate(() => Math.round(4 * Math.random() - 2) / 2 * 60)
      .padding(1)
      .font("Impact")
      .text(function(d) { return d[0]; })
      .on('end', draw);

  // end of TODO
  update();
  selection.on("change", update);

  function update() {
    // get the option of the select box
    const group = selection.property("value");
    // get the 100 most frequent words of the selected group
    let words = wordsPerGroup.get(group).slice(0, 100);

    //adjust the domain of the word size scale
    size.domain(d3.extent(words, (d) => d[1]));
    // start of TODO: adjust the layout accordingly
    // call the layout with the words -> layout.words(....)
    // end of TODO
    // then call layout.start() to start the layout
    layout.words(words)
        .fontSize(d => size(d[1]))
        .start();
    console.log(size.range()[0])
  }

  // complete the draw function to draw the word cloud
  function draw(words) {
    console.log(`#${words.length}`, words);

    // start of TODO: create the word cloud
    g.selectAll("text").remove();
    g.selectAll("text")
        .data(words)
        .enter()
        .append('text')
        .attr("text-anchor", "middle")
        .style('font-size', d => d.size + "px")
        .style("font-family", "Impact")
        .attr("fill", () => "#282828")
        .attr("fill-opacity", d => opacity(d.size))
        .attr('transform', d => `translate(${d.x}, ${d.y})  rotate(${d.rotate})`)
        .text(d => d[0]);
    // end of TODO
  }
}
