import * as d3 from "d3";


// Task 1 your solution here

async function loadData () {
    return await d3.csv("./Spotify_Music_Data.csv", d3.autoType);
}

const margin = { top: 10, left: 20, bottom: 20, right: 10 };
const pointSize = 1;
const pointSizeBrushed = 2;

let filteredData = {};
const categoricalAttrib = "year";
const numericalAttribs = ["danceability", "valence", "energy"];
let categories;
let uniqueCategories;
let colorScale;

loadData().then(data => {
    console.log("data loaded, processing");
    console.log(data);
    let selectedCols = [categoricalAttrib].concat(numericalAttribs);
    filteredData["columns"] = selectedCols;
    filteredData["entries"] = [];

    //create filtered data object only with selected columns
    for (const entry of data) {
        let filteredEntry = {}
        // if (entry["year"] < 2017) continue;

        for (const col of selectedCols) {
            filteredEntry[col] = entry[col]
        }
        filteredData.entries.push(filteredEntry)
    }
    //derive the values of the categorical attribute from all the data
    categories = filteredData.entries.map(d => d[categoricalAttrib]);
    //create a list of unique categories
    uniqueCategories = categories.filter((value, index, self) => self.indexOf(value) === index);
    //create a color scale for all plots
    colorScale = d3.scaleOrdinal()
        .domain(uniqueCategories)
        .range(d3.schemeCategory10)

    createLabel();
    createScatterPlotMatrix(width, height);
    createHorizontalParallelCoordinates(width, height / 2);
})

// Parent HTML element that contains the labels and the plots
const parent = d3.select("div#visualization");

// Sizes of the plots
const width = 800;
const height = 800;

// Set of selected items within the brush
const selectedItems = new Set();


/**
 * Task 2
 */
function createLabel() {
    let textHeight = 20;
    let textOffset = 6;

    //create a svg with size according to count of labels
    const svg = d3.select("svg#labels")
        .attr("viewBox", [0, 0, width, margin.top + margin.bottom + textHeight * uniqueCategories.length])
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //draw a bullet point with the color of each label
    svg.selectAll("circle")
        .data(uniqueCategories)
        .enter()
        .append("circle")
        .attr("cx", margin.left)
        .attr("cy", (d, i) => margin.top + textHeight * i)
        .attr("r", 5)
        .attr("fill", (d) => colorScale(d));

    //write a text next to each bullet
    svg.selectAll("text")
        .data(uniqueCategories)
        .enter()
        .append("text")
        .attr("x", margin.left + 12)
        .attr("y", (d, i) => margin.top + textOffset + textHeight * i)
        .text((d) => d);
}

/**
 * Create Scatter Plot Matrix with the given width and height. The contents of each cell
 * in this matrix is defined by the scatterPlot() function.
 *
 * @param {integer} width
 * @param {integer} height
 */
function createScatterPlotMatrix(width, height) {

    width -= margin.left + margin.right;
    height -= margin.top + margin.bottom;

    const numerics = ["danceability", "valence", "energy"]
    const cellHeight = height / numerics.length;
    const cellWidth = width / numerics.length;

    const fontSize = 10;

    const svg = parent.append("svg")
        .attr("viewBox", [0, 0, width, height]);

    const scatterplot_matrix = svg.selectAll("g.scatterplot")
        .data(d3.cross(numerics, numerics))
        .join("g")
        .attr("transform", (d, i) => "translate(" + (margin.left + (i % numerics.length) * cellWidth) + "," + (margin.top + Math.floor(i / numerics.length) * cellHeight) + ")");

    scatterplot_matrix.each(function (d) { // each pair from cross combination
        const g = d3.select(this);
        scatterPlot(d[0], d[1], g, cellWidth, cellHeight, margin);
        const labelXPosition = (cellWidth - margin.right - margin.left) / 2 + margin.left;
        const labelYPosition = 10;

        // label the same attribute axis
        if (d[0] == d[1]) {
            g.append("text")
                .text(d[0])
                .attr("transform", "translate(" + labelXPosition + "," + labelYPosition + ")")
                .style("text-anchor", "middle")
                .style("fill", "black")
                .style("font-size", fontSize);

        }
    })
}


/**
 * Task 3
 * @param {string} labelX
 * @param {string} labelY
 * @param {nodeElement} scatterplotCell
 * @param {integer} width
 * @param {integer} height
 * @param {Object} margin
 */
function scatterPlot(labelX, labelY, scatterplotCell, width, height, margin) {

    //calculate sizes for x and y axes
    const axisYwidth = width - margin.left - margin.right;
    const axisXheight = height - margin.top - margin.bottom;

    //filter which values will be x and y coordinates
    let keysX = filteredData.entries.map(d => d[labelX]);
    let valuesY = filteredData.entries.map(d => d[labelY]);

    scatterplotCell
        .attr("width", axisYwidth)
        .attr("height", axisXheight);

    //define axes ranges
    const xScale = d3.scaleLinear()
        .domain(d3.extent(keysX))
        .range([0, axisYwidth]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(valuesY))
        .range([axisXheight, 0]);

    //draw scatter plot dots
    scatterplotCell.selectAll("circle")
        .data(keysX)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d))
        .attr("cy", (d, i) => yScale(valuesY[i]))
        .attr("r", pointSize)
        .attr("fill", (d, i) => colorScale(categories[i]));

    //create visual graph axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    scatterplotCell.append("g")
        .attr("transform", `translate(0,${axisXheight})`)
        .call(xAxis);

    scatterplotCell.append("g")
        .call(yAxis);

    //add a brush event listener
    const brush = d3.brush()
        .extent([
            [margin.left, margin.top],
            [axisYwidth, axisXheight]
        ])
        .on("end", brushed); // for simplifiying the matter we do it only at the end.

    scatterplotCell.call(brush);


    function brushed(brushEvent) {
        const selection = brushEvent.selection
        //get all dots in the plot
        let circles = d3.select(this).selectAll("circle");

        if (selection) {
            //set different circle radii for dots inside / outside selection
            circles.attr("r", function(d) {
                let circ = d3.select(this);
                let isInside = isInsideBrush(selection, circ.attr("cx"), circ.attr("cy"));
                return isInside ? pointSizeBrushed : pointSize;
            });
        } else {
            // reset the radius of all circles if no brush selection
            circles.attr("r", pointSize);
        }
    }

    // A function that return TRUE or FALSE according if a dot is in the selection or not
    function isInsideBrush(brush_coords, cx, cy) {
        if (brush_coords)
            return brush_coords[0][0] <= cx && cx <= brush_coords[1][0] && brush_coords[0][1] <= cy && cy <= brush_coords[1][1];    // This return TRUE or FALSE depending on if the points
        else
            return false;
    }
}


/**
 * Task4
 * @param {integer} width
 * @param {integer} height
 */

function createHorizontalParallelCoordinates(width, height) {

    const svg = parent.append("svg")
        .attr("viewBox", [0, 0, width, height]);

    width -= margin.left + margin.right;
    height -= margin.top + margin.bottom;

    let attribValueLists = {};
    let scalesY = {};

    //create x-axis to distribute numerical attribute names
    let xScale = d3.scaleBand()
        .domain(numericalAttribs)
        .range([margin.left, margin.left + width]);

    let axisX = d3.axisBottom(xScale);

    //create y-axes for each attribute
    for (let attrib of numericalAttribs) {
        //filter all values of one attributes
        let values  = filteredData.entries.map(d => d[attrib]);
        attribValueLists[attrib] = values;
        scalesY[attrib] = d3.scaleLinear()
            .domain([d3.min(values), d3.max(values)])
            .range([margin.top + height, margin.top]);

        const axisY = d3.axisLeft(scalesY[attrib]);

        //draw y-axes
        svg.append("g")
            .attr("transform", `translate(${xScale(attrib) + xScale.bandwidth() / 2}, 0)`)
            .call(axisY);
    }

    //draw x-axis
    svg.append('g')
        .attr("class", "y-axis")
        .attr("transform", `translate(0, ${margin.top + height})`)
        .call(axisX);

    //plot lines for all attributes between the values of ith and i + 1st attribute
    for (let k = 0; k < numericalAttribs.length - 1; ++k) {
        let attrib1 = numericalAttribs[k];
        let attrib2 = numericalAttribs[k + 1];

        let values1 = attribValueLists[attrib1];
        let values2 = attribValueLists[attrib2];
        let yScale1 = scalesY[attrib1];
        let scale2 = scalesY[attrib2];

        svg.selectAll("paths")
            .data(values1)
            .enter()
            .append("line")
            .attr("x1", xScale(attrib1) + xScale.bandwidth() / 2)
            .attr("y1", (d) => yScale1(d))
            .attr("x2", xScale(attrib2) + xScale.bandwidth() / 2 )
            .attr("y2", (d, i) => scale2(values2[i]))
            .style("stroke", (d, i) => colorScale(categories[i]))
            .style("opacity", 0.3);
    }

    const brushWidth = 10;
    const brush = d3.brushY()
        .extent([
            [-brushWidth / 2, margin.top],
            [brushWidth / 2, height - margin.bottom]
        ])
        .on("end", brushed);
    axes.call(brush);

    function brushed(brushEvent, key) {
        const selection = brushEvent.selection
        const attributeName = key[0]

        // Add your code here
    }
}
