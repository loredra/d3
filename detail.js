var detail=d3.select("#detail_info");
var firstLoad=true;
function populateDetailPage(node){
  
  //////////////////////Populate content in to detail div/////////////////// 
         d3.selectAll(".detail_name").remove();
         d3.selectAll(".detail_address").remove();
         d3.selectAll(".ul_list_List").remove();
	

   detail.select("#name").append("div").text(node.name)
	  .attr("class","detail_name")
	  .attr("position","relative");
   detail.select("#address").append("div").text(node.address)
	  .attr("class","detail_address")
	  .attr("position","relative");
	
/////////////////////////Preparing data to populate the list////////////////////////
    var listList="";
    var numOfList;
    

    try {listList1=node.isListedIn;
	
      for(i in listList1){
	listList=listList.concat(listList1[i].Name,",");
	
      }
      // 	listList=node.datum().isListedIn
// 	.each().Name.toString().split(",");
      listList= listList.slice(0, -1);
      listList=listList.split(",");
      if(listList=="")
	numOfList=0;
	else
   numOfList=listList.length;
}
catch(err) {
    numOfList=0;
}
d3.select(".numOfList")
	.text(numOfList);
try {
    var listAKA=node.AKA;
// 	listAKA=listAKA.split(",");
    }
catch(err) {  }

try {
    var listKA=node.KnownAddress;
// 	listKA=listKA.split(",");
    }
catch(err) {  }

////////////////////////////////////////////////////////////////////
	var listOfList=d3.select("#listList").append("ul")
        .attr("class","ul_list_List")
        .selectAll("li")
        .data(listList)
	    .enter()
	    .append("li")
	    .attr("class","listList")
	    .style("font-size", 15 + "px")
	    .text(function(d){return d})
	    .style("text-anchor", "start")
	    .on("click",overlay);

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
	    
	 var listOfKA=d3.select("#listKA").append("ul")
        .attr("class","ul_list_List")
        .selectAll("li")
        .data(listKA)
	    .enter()
	    .append("li")
	    .attr("class","listKA")
	    .style("font-size", 15 + "px")
	    .text(function(d){return d})
	    .style("text-anchor", "start");
}
function overlay() {
	el = d3.select("#overlay");
	el.
	style("visibility",
	  (el.style("visibility") == "visible") ? "hidden" : "visible");
	
	el.select(".close")
	.on("click",closeOverlay);
	
}
function closeOverlay() {
  
	el = d3.select("#overlay");
	d3.select(".close")
	.on("click",el.style("visibility","hidden"));
	
}
function click(list) {
    
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
/////////////////////////Making the image bigger///////////////////////////
       var node=d3.selectAll(".node")
      .filter(function(d) { return d.id==list.id; });

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
 
///////////////First load then color the first node/////////////////////////
             
	d3.selectAll("li")
      .style("background","#cce5ff");
      
      if(firstLoad){
      d3.select("#list").select("li")
      .style("background","#ffa366");
      firstLoad=false;
	}
	else
	  {
      d3.select(this)
      .style("background","#ffa366");
	}
///////////////////////////////////////////////////////////////////////////
      populateDetailPage(node.datum());


      }
//////////////////////////////////////////////////////////////////////////// 
d3.json("pst2.json", function(error, graph) {
 if (error) throw error;

 var list=d3.select("#list").append("ul").selectAll("li")
	    .data(graph.nodes)
	    .enter()
	    .append("li")
 	    .attr("id",function(d,i) {return "index"+i;})
	    .style("font-size", 15 + "px")
	    .text(function(d) { return d.name; })
	    .style("text-anchor", "start")
	    .on("click",click);


 click(d3.select("#list").select("li").datum());


 });