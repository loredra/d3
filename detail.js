 
d3.json("pst2.json", function(error, graph) {
 if (error) throw error;
	
 var list=d3.select("#detail_info").append("ul").selectAll("li")
	    .data(graph.nodes)
	    .enter()
	    .append("li")
	    .style("font-size", 15 + "px")  
	    .text(function(d) { return d.name; })
	    .style("text-anchor", "left");
      
      }
   );