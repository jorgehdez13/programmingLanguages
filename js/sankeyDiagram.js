document.addEventListener('DOMContentLoaded', function() {
    d3.csv('data/data.csv').then(function(data) {
        const nodes = [];
        const links = [];

        // Process data to create nodes and links for the Sankey Diagram
        data.forEach(d => {
            // Add language as a node if not already present
            if (!nodes.some(n => n.name === d.language)) {
                nodes.push({ name: d.language });
            }

            // Add platforms as nodes and create links
            const platforms = d.platforms.replace(/"/g, '').split(',');
            platforms.forEach(platform => {
                platform = platform.trim();
                if (!nodes.some(n => n.name === platform)) {
                    nodes.push({ name: platform });
                }
                links.push({
                    source: nodes.findIndex(n => n.name === d.language),
                    target: nodes.findIndex(n => n.name === platform),
                    value: 1  // You can adjust the value based on more complex data if needed
                });
            });
        });

        const width = 800;
        const height = 600;

        const svg = d3.select("#sankeyDiagramContainer").append("svg")
            .attr("width", width)
            .attr("height", height);

        const sankey = d3.sankey()
            .nodeWidth(20)
            .nodePadding(20)
            .extent([[1, 1], [width - 1, height - 6]]);

        const { nodes: sankeyNodes, links: sankeyLinks } = sankey({
            nodes: nodes.map(d => Object.assign({}, d)),
            links: links.map(d => Object.assign({}, d))
        });

        // Draw links
        svg.append("g")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.5)
            .selectAll("path")
            .data(sankeyLinks)
            .join("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke", "#007bff")
            .attr("stroke-width", d => Math.max(1, d.width));

        // Draw nodes
        const node = svg.append("g")
            .selectAll("g")
            .data(sankeyNodes)
            .join("g");

        node.append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", "teal")
            .attr("stroke", "#333")
            .append("title")
            .text(d => `${d.name}\n${d.value}`);

        node.append("text")
            .attr("x", d => d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(d => d.name)
            .filter(d => d.x0 < width / 2)
            .attr("x", d => d.x1 + 6)
            .attr("text-anchor", "start");
    }).catch(error => console.error('Error loading the data:', error));
});
