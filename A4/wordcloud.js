import * as d3 from "d3";
import cloud from "d3-cloud";
/* Function to draw a word cloud
 * svg: d3 selection of an svg element
 * wordsPerGenre: Map of form {group =>  [[word, frequency], [word, frequency], ...], ...}
 * selection: d3 selection of select element
 */
export function wordcloud({ svg, wordsPerGroup, selection }) {
  const width = 600;
  const height = 200;
  svg.attr("viewBox", [0, 0, width, height]);

  // group element, translated such that the origin is in the middle of the svg
  const g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // word size scale, you can play around with the range if you like
  const size = d3.scaleLinear().range([10, 50]);

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
  // const layout =


  // end of TODO
  update();
  selection.on("change", update);


  function update() {
    // get the option of the select box
    const group = selection.property("value");
    // get the 100 most frequent words of the selected group
    const words = wordsPerGroup.get(group).slice(0, 100);

    //adjust the domain of the word size scale
    size.domain(d3.extent(words, (d) => d[1]));
    // start of TODO: adjust the layout accordingly
    // call the layout with the words -> layout.words(....)
    // end of TODO

    layout.start(); // then call layout.start() to start the layout

  }

  // complete the draw function to draw the word cloud
  function draw(words) {
    // start of TODO: create the word cloud
    // g.selectAll("text").data(words)

    // end of TODO
  }
}
