var detail=d3.select("#detail_info");

d3.json("pst2.json", function(error, graph) {
 if (error) throw error;
	
 var list=d3.select("#list").append("ul").selectAll("li")
	    .data(graph.nodes)
	    .enter()
	    .append("li")
// 	    .attr("id",function(d,i) {}j)
	    .style("font-size", 15 + "px")
	    .text(function(d) { return d.name; })
	    .style("text-anchor", "start")
	    .on("click",click);




/*
   var detail=d3.select("#detail_info")
	    .data(graph.nodes)
	    .enter()
	    .append("li")
	    .style("font-size", 15 + "px")  
	    .text(function(d) { return d.name; })
	    .style("
	    nchor", "left");
      }*/
      
  function click(list) {
  d3.selectAll("li")
      .style("background","#cce5ff");
  
  d3.select(this)
      .style("background","#ffa366");
 /////////////////////Return everything in svg to normal///////////////////       
  vis=d3.selectAll(".highlight_circle");
	
      vis.attr("transform", "scale(0.1,0.1)")
	.attr("opacity",0);
      
	 d3.selectAll(".node").select(".node_image").transition()
	.duration(750)
	.attr("x",-12)
	.attr("y", -12)
	.attr("width", "24px")
	.attr("height", "24px");
///////////////////////////////////////////////////////////////////////////      	
       var node=d3.selectAll(".node")
      .filter(function(d) { return d.id==list.id; })

    node.attr("isChosen", "yes")
      .select(".node_image")     
      .transition()
      .duration(750)
      .attr("x",-20)
      .attr("y", -20)
      .attr("width","40px")
      .attr("height", "40px");
      
      node.select(".highlight_circle")
	.transition()
	.duration(450)
	.attr("transform", "scale(1,1)" )
	.attr("opacity",0.7);
      
      translateBeforeChose(node.datum().x,node.datum().y);

         d3.selectAll(".detail_name").remove();
         d3.selectAll(".detail_address").remove();
         d3.selectAll(".ul_list_List").remove();

   detail.select("#name").append("div").text(node.attr("name"))
	  .attr("class","detail_name")
	  .attr("position","relative");
   detail.select("#address").append("div").text(node.attr("address"))
	  .attr("class","detail_address")
	  .attr("position","relative");

	var listList;
	var listAKA=node.datum().AKA.toString();
     
	listList=node.attr("isListedIn").split(",");
	listAKA=listAKA.split(",");
	
	var numOfList=listList.length; 
        d3.select(".numOfList")
	.text(numOfList);
	
	var listOfList=d3.select("#listList").append("ul")
        .attr("class","ul_list_List")
        .selectAll("li")
        .data(listList)
	    .enter()
	    .append("li")
	    .attr("class","listList")
	    .style("font-size", 15 + "px")
	    .text(function(d){return d})
	    .style("text-anchor", "start");
	    
	var listOfAKA=d3.select("#listAKA").append("ul")
        .attr("class","ul_list_List")
        .selectAll("li")
        .data(listAKA)
	    .enter()
	    .append("li")
	    .attr("class","listAKA")
	    .style("font-size", 15 + "px")
	    .text(function(d){return d})
	    .style("text-anchor", "start");

      }
    });