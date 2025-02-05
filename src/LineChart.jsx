// Import necessary libraries
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const LineChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Sample data
    const data = [
      { x: 0, y: 30 },
      { x: 1, y: 50 },
      { x: 2, y: 80 },
      { x: 3, y: 40 },
      { x: 4, y: 70 },
      { x: 5, y: 60 },
    ];

    const domElement = document.querySelector(".pattern-drawing");
    console.log(domElement);

    // Set up chart dimensions
    const width = domElement.offsetWidth;
    const height = domElement.offsetHeight;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Select the SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x))
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create the line generator
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Append the line path
    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);

    // Add X axis
    svg
      .selectAll(".x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(data.length));

    // Add Y axis
    svg
      .selectAll(".y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
  }, []);

  return (
    <div className="pattern-drawing" id="pattern-drawing">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineChart;
