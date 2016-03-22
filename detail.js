 
d3.json("pst2.json", function(error, graph) {
 if (error) throw error;
	
 var list=d3.select("#list").append("ul").selectAll("li")
	    .data(graph.nodes)
	    .enter()
	    .append("li")
	    .style("font-size", 15 + "px")  
	    .text(function(d) { return d.name; })
	    .style("text-anchor", "left")
	    .on("click",click);
	    
/*	    
   var detail=d3.select("#detail_info")
	    .data(graph.nodes)
	    .enter()
	    .append("li")
	    .style("font-size", 15 + "px")  
	    .text(function(d) { return d.name; })
	    .style("text-anchor", "left");
      }*/
      
      function click(list) {
  d3.selectAll("li")
      .style("background","#cce5ff");
  
  d3.select(this)
      .style("background","#ffa366");
      
	 d3.selectAll(".node"). transition()
	.duration(750)
	.attr("width", "24px")
	.attr("height", "24px");
	
       var node=d3.selectAll(".node")
      .filter(function(d) { return d.id==list.id; })
     node
      .attr("isChosen", "yes")
      .transition()
      .duration(750)
      .attr("width","35px")
      .attr("height", "35px");
      
      translateBeforeChose(node.attr("x"),node.attr("y"));
      }
    });