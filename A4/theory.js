import * as d3 from "d3";

export function theoryQuestions({ svg }) {
    const margin = { top: 20, right: 20, bottom: 30, left: 20 };
    const width = 600;
    const height = 200;
    svg.attr("viewBox", [0, 0, width, height]);

    createQ1(svg, margin, width, height);

    // answer the questions by calling the function answerQ1
    // graph with multiple attributes
    answerQ1(svg, "parallel coordinates", "discover multi-attribute correlation");
    // is left
    answerQ1(svg, "scatterplots", "identify patterns");
    //locate if something is used exceptionally often
    answerQ1(svg, "wordcloud", "locate outliers");
    // MATHEMATICS
    // the study of geometrical properties and spatial relations unaffected by the continuous change of shape or size of figures.
    // idk tiles are pretty spatial?
    answerQ1(svg, "icicle map", "browse topology");
    // easy to view ups and downs
    answerQ1(svg, "horizon charts", "compare trends");}

/**
 *
 * @param {*} svg keep it svg
 * @param {*} technique choose of one of the following: "parallel coordinates", "scatterplots", "icicle map", "wordcloud"
 * @param {*} actionTarget choose of one of the following: "discover multi-attribute correlation", "identify patterns", "browse topology", "locate outliers"
 */
function answerQ1(svg, technique, actionTarget) {
    const lineGenerator = d3.line()
        .curve(d3.curveCardinal);

    let source = null;
    let destination = null;
    d3.selectAll("text.visTechniques").each(function (d, i) {

        if (d == technique) {
            source = this
        }
    })
    d3.selectAll("text.actionTarget").each(function (d, i) {
        if (d == actionTarget) {
            destination = this
        }
    })

    const sourceX = source.transform.baseVal.getItem(0).matrix.e + source.getBBox().width + 5
    const sourceY = source.transform.baseVal.getItem(0).matrix.f + source.getBBox().height


    const destinationX = destination.transform.baseVal.getItem(0).matrix.e - destination.getBBox().width - 5
    const destinationY = destination.transform.baseVal.getItem(0).matrix.f + destination.getBBox().height

    svg.append("path")
        .attr("d", function () {
            const points = [
                [sourceX, sourceY],
                [destinationX, destinationY]
            ];
            const bundleCurve = d3.curveBundle.beta(0.5);
            lineGenerator.curve(bundleCurve);
            return lineGenerator(points);
        })
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", 1);
}

function createQ1(svg, margin, width, height) {
    const visTechniques = ["parallel coordinates", "scatterplots", "icicle map", "wordcloud", "horizon charts"]
    const targetAction = ["discover multi-attribute correlation", "identify patterns", "browse topology", "locate outliers", "compare trends"]

    const g = svg
        .append("g")
        .attr("transform", "translate(" + 0 + "," + margin.top + ")");

    const ySpaces = height / (visTechniques.length + 1);

    g.append("text")
        .attr("text-anchor", "left")
        .attr("font-size", "small")
        .attr("font-weight", "bold")
        .attr("font-style", "oblique")
        .text("Techniques")
        .classed("visTechniques", true)
        .attr("transform", "translate(" + margin.left + "," + 10 + ")");

    g.selectAll("text#visTechniques")
        .data(visTechniques)
        .join("text")
        .attr("text-anchor", "left")
        .attr("font-size", "small")
        .text((d, i) => d)
        .attr("transform", (d, i) => {
            const yPos = ySpaces + (+ i * ySpaces);
            return "translate(" + margin.left + "," + yPos + ")"
        })
        .classed("visTechniques", true)

    g.append("text")
        .attr("text-anchor", "end")
        .attr("font-size", "small")
        .attr("font-weight", "bold")
        .attr("font-style", "oblique")
        .text("Action-Target")
        .classed("actionTarget", true)
        .attr("transform", "translate(" + (width - margin.right) + "," + 10 + ")")

    g.selectAll("text#targetAction")
        .data(targetAction)
        .join("text")
        .attr("text-anchor", "end")
        .attr("font-size", "small")
        .text((d, i) => d)
        .attr("transform", (d, i) => {
            const ySpaces = height / (visTechniques.length + 1);
            const yPos = ySpaces + i * ySpaces;

            return "translate(" + (width - margin.right) + "," + yPos + ")"
        })
        .classed("actionTarget", true)

}