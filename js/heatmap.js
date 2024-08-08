document.addEventListener('DOMContentLoaded', function () {
    d3.json('data/data.json').then(function (data) {
        // Extract the unique languages
        const languages = data.map(d => d.language);
        const languageMap = new Map(languages.map(l => [l, { salary: data.find(d => d.language === l).average_salary }]));

        // Create a matrix of correlations based on average salary
        const matrix = languages.map(l1 =>
            languages.map(l2 => ({
                language1: l1,
                language2: l2,
                correlation: 1 - Math.abs(languageMap.get(l1).salary - languageMap.get(l2).salary) / 100000 // Normalized correlation
            }))
        ).flat();

        const margin = { top: 20, right: 30, bottom: 40, left: 90 },
            width = 800 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#heatmapContainer")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .domain(languages)
            .padding(0.05);

        const y = d3.scaleBand()
            .range([height, 0])
            .domain(languages)
            .padding(0.05);

        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, 1]);

        svg.append("g")
            .call(d3.axisBottom(x))
            .attr("transform", `translate(0,${height})`);

        svg.append("g")
            .call(d3.axisLeft(y));

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll()
            .data(matrix)
            .enter()
            .append("rect")
            .attr("x", d => x(d.language1))
            .attr("y", d => y(d.language2))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => colorScale(d.correlation))
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`${d.language1} & ${d.language2}<br/>Correlation: ${d.correlation.toFixed(2)}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Create color legend
        const legendWidth = 150;
        const legendHeight = height;
        const legendSvg = d3.select("#heatmapLegend")
            .append("svg")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .append("g");

        const numThresholds = 10;
        const thresholds = d3.range(0, 1.1, 1 / numThresholds);  // 10 thresholds

        const legend = legendSvg.selectAll(".legend")
            .data(thresholds)
            .enter()
            .append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * (legendHeight / numThresholds))
            .attr("width", legendWidth - 20)
            .attr("height", legendHeight / numThresholds)
            .style("fill", d => colorScale(d));

        legend.append("text")
            .attr("x", 10)
            .attr("y", (d, i) => i * (legendHeight / numThresholds) + (legendHeight / numThresholds) / 2)
            .text(d => `${d.toFixed(1)} - ${(d + (1 / numThresholds)).toFixed(1)}`)
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle");

        d3.select("#heatmapLegend")
            .append("div")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("margin-bottom", "10px")
            .text("Correlation");

        // Create a table for the color legend
        const table = d3.select("#heatmapTable");
        const thead = table.append("thead").append("tr");
        thead.append("th").text("Correlation Range");
        thead.append("th").text("Color");

        const tbody = table.append("tbody");
        thresholds.forEach((d, i) => {
            const row = tbody.append("tr");
            row.append("td").text(`${d.toFixed(1)} - ${(d + (1 / numThresholds)).toFixed(1)}`);
            row.append("td").append("div")
                .style("width", "50px")
                .style("height", "20px")
                .style("background-color", colorScale(d))
                .style("display", "inline-block");
        });

    }).catch(function (error) {
        console.error('Error loading or parsing data:', error);
    });
});
