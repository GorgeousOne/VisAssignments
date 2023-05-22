import * as d3 from "d3";


// Task 1 your solution here

async function loadData () {
    return await d3.csv("./Spotify_Music_Data.csv", d3.autoType);
}

const margin = { top: 10, left: 20, bottom: 20, right: 10 };

let spotifyData = {};
const categoricalAttrib = "year";
const numericalAttribs = ["danceability", "valence", "energy"];
let categories;
let uniqueCategories;
let colorScale;

loadData().then(data => {
    console.log("data loaded, processing");
    console.log(data);
    let selectedCols = [categoricalAttrib].concat(numericalAttribs);
    spotifyData["columns"] = selectedCols;
    spotifyData["entries"] = [];

    for (const entry of data) {
        let filteredEntry = {}
        // if (entry["year"] < 2017) {
        //     continue;
        // }
        for (const col of selectedCols) {
            filteredEntry[col] = entry[col]
        }
        spotifyData.entries.push(filteredEntry)
    }
    categories = spotifyData.entries.map(d => d[categoricalAttrib]);
    uniqueCategories = categories.filter((value, index, self) => self.indexOf(value) === index);
    colorScale = d3.scaleOrdinal()
        .domain(uniqueCategories)
        // .range(["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"])
        .range(d3.schemeCategory10)

    //draw
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
    // Add your solution here
    const svg = d3.select("svg#labels")
        .attr("viewBox", [0, 0, width, 200]);

    svg.selectAll("circle")
        .data(uniqueCategories)
        .enter()
        .append("circle")
        .attr("cx", margin.left)
        .attr("cy", (d, i) => margin.top + 20 * i)
        .attr("r", 5)
        .attr("fill", (d) => colorScale(d));

    svg.selectAll("text")
        .data(uniqueCategories)
        .enter()
        .append("text")
        .attr("x", margin.left + 12)
        .attr("y", (d, i) => margin.top + 6 + 20 * i)
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

    // Add your solution here
    const axisYwidth = width - margin.left - margin.right;
    const axisXheight = height - margin.top - margin.bottom;

    let keysX = spotifyData.entries.map(d => d[labelX]);
    let valuesY = spotifyData.entries.map(d => d[labelY]);

    scatterplotCell
        .attr("width", axisYwidth)
        .attr("height", axisXheight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([d3.min(keysX), d3.max(keysX)])
        .range([0, axisYwidth]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(valuesY), d3.max(valuesY)])
        .range([axisXheight, 0]);

    scatterplotCell.selectAll("circle")
        .data(keysX)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d))
        .attr("cy", (d, i) => yScale(valuesY[i]))
        .attr("r", 2)
        .attr("fill", (d, i) => colorScale(categories[i]));

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    scatterplotCell.append("g")
        .attr("transform", `translate(0,${axisXheight})`)
        .call(xAxis);

    scatterplotCell.append("g")
        .call(yAxis);

    const brush = d3.brush()
        .extent([
            [margin.left, margin.top],
            [axisYwidth, axisXheight]
        ])
        .on("end", brushed); // for simplifiying the matter we do it only at the end.

    scatterplotCell.call(brush);


    function brushed(brushEvent) {

        const selection = brushEvent.selection
        const scatterPLotD3 = d3.select(this) //  this always refers to the current plot


        // Add solution here

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

    // Add your solution here
    const svg = parent.append("svg")
        .attr("viewBox", [0, 0, width, height]);

    width -= margin.left + margin.right;
    height -= margin.top + margin.bottom;

    // let keysX = spotifyData.entries.map(d => d[labelX]);
    // let valuesY = spotifyData.entries.map(d => d[labelY]);
    svg.attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let attribValueLists = {};
    let scalesY = {};

    for (let attrib of numericalAttribs) {
        let values  = spotifyData.entries.map(d => d[attrib]);
        attribValueLists[attrib] = values;
        scalesY[attrib] = d3.scaleLinear()
            .domain([d3.min(values), d3.max(values)])
            .range([height, 0]);
    }

    console.log(attribValueLists)

    for (let k = 0; k < numericalAttribs.length - 1; ++k) {
        let attrib1 = numericalAttribs[k];
        let attrib2 = numericalAttribs[k + 1];
        console.log("creating", attrib1, attrib2);

        let values1 = attribValueLists[attrib1];
        let values2 = attribValueLists[attrib2];
        let yScale1 = scalesY[attrib1];
        let scale2 = scalesY[attrib2];
        console.log("line", attrib1, attrib2)

        let x1 = k * width / (numericalAttribs.length - 1);
        let x2 = (k + 1) * width / (numericalAttribs.length - 1);

        svg.selectAll(".line")
            .data(values1)
            .enter()
            .append("line")
            .attr("x1", x1)
            .attr("y1", (d) => yScale1(d))
            .attr("x2", x2)
            .attr("y2", (d, i) => scale2(values2[i]))
            .style("stroke", (d, i) => colorScale(categories[i]))
            .style("opacity", 0.3);
    }

    let xScale = d3.scaleBand()
        .domain(numericalAttribs)
        .range([-1/4 * width, 5/4 * width]);

    let axisX = d3.axisBottom(xScale);

    svg.append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(axisX);

    for (let i = 0; i < numericalAttribs.length; ++i) {
        let attrib = numericalAttribs[i];
        let yScale = scalesY[attrib];

        let dx = i * width / (numericalAttribs.length - 1);
        const axisY = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", `translate(${dx}, 0)`)
            .call(axisY);
    }

    const brushWidth = 10;
    const brush = d3.brushY()
        .extent([
            [-brushWidth / 2, margin.top],
            [brushWidth / 2, height - margin.bottom]
        ])
        .on("end", brushed);
    // axes.call(brush);



    function brushed(brushEvent, key) {

        const selection = brushEvent.selection
        const attributeName = key[0]

        // Add your code here


    }
}
