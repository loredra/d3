var detail=d3.select("#detail_info");

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

        d3.select(".detail_name").remove();
        d3.select(".detail_address").remove();
        //d3.select(".listList").remove();
        d3.select(".ul_list_List").remove();

   detail.select("#name").append("div").text(node.attr("name"))
	  .attr("class","detail_name")
	  .attr("position","relative");
   detail.select("#address").append("div").text(node.attr("address"))
	  .attr("class","detail_address")
	  .attr("position","relative");

     var listList;
       listList=node.attr("isListedIn").split(",");

          var listOfList=d3.select("#listList").append("ul")
        .attr("class","ul_list_List")
        .selectAll("li")
        .data(listList)
	    .enter()
	    .append("li")
        .attr("class","listList")
	    .style("font-size", 15 + "px")
	    .text(function(d){return d})
	    .style("text-anchor", "left")
        ;

      }
    });