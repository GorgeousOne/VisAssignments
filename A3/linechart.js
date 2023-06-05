import * as d3 from "d3";
import {bigMoneyFormat, shortenText} from "./src/utils.js";

export function lineChart({
							  svg,
							  data,
							  width = 1000,
							  height = 800,
							  margin = {top: 30, right: 120, bottom: 30, left: 50},
						  }) {
	// setup the viewBox and font for the SVG
	svg.attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif");

	// define an attribute for y axis
	const attributeY = data.map(movie => movie.totalGross);

	// define an attribute for x axis
	const attributeX = data.map(movie => movie.day);

	// define scale for the number of days on the x-axis
	const scaleX = d3.scaleLinear()
		.domain([1, d3.max(attributeX)])
		.range([margin.left, width - margin.right])

	// define scale for total weekly gross on the y-axis
	const scaleY = d3.scaleLinear()
		.domain([0, d3.max(attributeY)])
		.range([height - margin.top, margin.bottom]);

	// group the data by movie title
	const movies = d3
		.groups(data, (d) => d.title)
		.map(([key, values]) => ({key, values}));

	// draw the x-axis
	const axisX = d3.axisBottom(scaleX);
	svg.append("g")
		.attr("transform", `translate(0,${height - margin.top})`)
		.call(axisX);

	// put the text label for x axis
	svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", height - 6)
		.text("days after release");

	// draw the y-axis
	const axisY = d3.axisLeft(scaleY).tickFormat(d => { return bigMoneyFormat(d); });
	svg.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.call(axisY);

	// put the text label for y axis
	svg.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.attr("y", 6)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("total gross in $");

	// color scale by movie title
	const color = d3.scaleOrdinal()
		.domain(movies.map(d => d.key))
		.range(d3.schemeCategory10)

	// define line generator
	let lineGen = d3.line()
		.x(d => scaleX(d.day))
		.y(d => scaleY(d.totalGross));

	// draw a line for each time series as well as labels
	// add the line as a path element
	svg.selectAll("path")
		.data(movies)
		.enter()
		//draw separate line for each movie
		.append("path")
		.attr("d", d => lineGen(d.values))
		.attr("fill", "none")
		.attr("stroke", d => color(d.key))
		.attr("stroke-width", 2)
		.each(function (d) {
			const lastDay = d.values.slice(-1)[0]
			// add labels for the series
			svg.append("text")
				.attr("x", scaleX(lastDay.day))
				.attr("y", scaleY(lastDay.totalGross) - 6)
				.text(d.key);
		})

	// setup a group node for each time series
	const series = svg
		.append("g")
		.style("font", "bold 10px sans-serif")
		.selectAll("g")
		.data(movies)
		.join("g");


	// Optional brushing task start here

	// Uncomment this part below to start your brushing task
	// Hint: this will create the total gross difference label (by default, the last data point) above your movie title label

	/**
  series
    .append("text")
    .classed("totalGrossDiff", true)
    .datum((d) => ({
      key: d.key,
      value: d.values[d.values.length - 1][attributeY],
    }))
    .attr("fill", "none")
    .attr("stroke-width", 1)
    .attr("x", scaleX.range()[1] + 3)
    .attr("y", (d) => scaleY(d.value) - 15)
    .attr("dy", "0.35em")
    .text((d) => bigMoneyFormat(d.value))
    .attr("fill", (d) => color(d.key))
	 *
	 */


	// Define the brush
	// const linechartBrush =

	// Call the brush


	function brushed(brushEvent) {
		const selection = brushEvent.selection;

		// Map container for the total gross difference label for each movie
		const updateLabel = new Map();

		if (selection) {
			// find the brush point on the x-axis at the beginning and end of the brush
			// const minX =
			// const maxX =

			// find the line for all movie
			const lines = series.selectAll("path");

			// find the point on the line for each movie at the beginning and end of the brush

			// use interpolateLine function to find the totalGrosss values for each movie at both brush points

			// find the total gross difference between the beginning and end of the brush

			// update the total gross difference label for each movie


			if (updateLabel.size > 0) {
				series
					.selectAll("text.totalGrossDiff")
					.text((d) => bigMoneyFormat(updateLabel.get(d.key)))
					.attr("fill", (d) => color(d.key))
			}
		}

	}

	function interpolateLine(moviesLine, i, brushPointX) {
		if (moviesLine == undefined || i == undefined || brushPointX == undefined) {
			return 0;
		} else if (attributeX in moviesLine[i] && attributeY in moviesLine[i] &&
			typeof moviesLine[i][attributeX] == "number" && typeof moviesLine[i][attributeY] == "number") {
			const a = [moviesLine[i][attributeX], moviesLine[i][attributeY]];

			let b;
			if (moviesLine[i + 1] == undefined || moviesLine[i + 1][attributeX] == undefined || moviesLine[i + 1][attributeY] == undefined) {
				b = [moviesLine[moviesLine.length - 1][attributeX], moviesLine[moviesLine.length - 1][attributeY]];
			} else {
				b = [moviesLine[i + 1][attributeX], moviesLine[i + 1][attributeY]];
			}

			if (a[0] == b[0] && b[1] == a[1]) {
				return b[1];
			}

			const m = (b[1] - a[1]) / (b[0] - a[0]);
			return m * (brushPointX - a[0]) + a[1];
		}
		return 0;
	}

}
