var detail=d3.select("#detail_info");
var firstLoad=true;
var isAdvancedSearchClose=true;
var isFirstAdvancedSearchOpen=true;
tooltip=d3.select(".tooltip");
dummyData = [
{"name":"USSDN"},
{"name":"Long Long Long Long one"},
{"name":"Short"},
{"name":"CSFDSFSS" } ];

// Dummy data and execution for Advanced Search
function showAdvancedSearch(){
  if(isFirstAdvancedSearchOpen){
    advanced_search=d3.select("#main_layout").insert("div", ":first-child");
    
    advanced_search
    .attr("class","advanced_search_collapsible");
    
    
    black_list_filter=advanced_search
    .append("div")
    .attr("class","filter")
    .attr("id","black_list_filter");
    
    black_list_filter
    .append("span")
    .attr("class","filter_label")
    .text("Black List");
    
    black_list_filter
    .append("div")
    .attr("class","criteria_container")
    .append("div")
    .attr("class","criteria")
    .text("This is a 65 characters long and it is the same as average list name");
    
    sanction_filter=advanced_search.append("div")
    .attr("class","filter")
    .attr("id","sanction_filter");
    
    sanction_filter
    .append("span")
    .attr("class","filter_label")
    .text("Sanction List");
    
    sanction_filter
    .append("div")
    .attr("class","criteria_container");
    
    sanction_filter.select(".criteria_container").selectAll("div")
    .data(dummyData)
    .enter()
    .append("div")
    .attr("class","criteria")
    .text(function(d){ return "#"+d.name; });
    
     country_filter=advanced_search
    .append("div")
    .attr("class","filter")
    .attr("id","country_filter");
    
    country_filter
    .append("span")
    .attr("class","filter_label")
    .text("Country");
    
     city_filter=advanced_search
    .append("div")
    .attr("class","filter")
    .attr("id","city_filter");
    
    city_filter.append("span")
    .attr("class","filter_label")
    .text("City");
    
    isFirstAdvancedSearchOpen=false;
    }
  if(isAdvancedSearchClose){
    d3.select(".advanced_search_collapsible")
    .style("display","");
    isAdvancedSearchClose=false;
  }
  else{
    d3.select(".advanced_search_collapsible")
      .style("display","none");
      isAdvancedSearchClose=true;
      }
}

function mouseOverList(date) {
      try{
    tooltip=d3.select(".tooltip");
    tooltip.style("visibility", "visible");
    tooltip.html(
    "Expiration Date: "+date);
        }
        catch(err){
	tooltip.style("visibility", "hidden");


	}

  }
     function mouseout(node) {
    tooltip
    .style("visibility", "hidden");
    }

       function mousemove(node) {
     tooltip.style("top", (d3.event.pageY + 16) + "px")
            .style("left", (d3.event.pageX + 16) + "px");
}

function populateDetailPage(node){
  ///Special case for changing Identification
  
switch (node.type) {
  case "company":
       d3.select("#identification_label")
      .text("Company Register ID");
    break;
  case "human":
       d3.select("#identification_label")
      .text("Passport");
    break;
  case "bank":
       d3.select("#identification_label")
      .text("Bank ID");
    break;
default:
        d3.select("#identification_label")
      .text("Identification");
    break;
}
  

  
  //////////////////////Populate content in to detail div/////////////////// 
         d3.select(".detail_name").remove();
         d3.select(".detail_address").remove();
	  d3.select(".identification").remove();
	 d3.select(".country").remove();
         d3.selectAll(".ul_list_List").remove();
	
	
    //////////////////////Populate content in to detail div///////////////////
    var listList="";
    var numOfList;
    var measures=null;
    try{
   measures=node.AllMeasures;
    }catch(e){
    measures=["arms"];
    }
    
   /////////////////////////////////////////////////////////////////////////// 
   detail.select("#name").append("div").text(node.name)
	  .attr("class","detail_name")
	  .attr("position","relative");
	  
   detail.select("#address").append("div").text(node.address)
	  .attr("class","detail_address")
	  .attr("position","relative");
	  
   detail.select("#identification_container").append("div").text(node.Identification)
	  .attr("class","identification")
	  .attr("position","relative");
	  
    detail.select("#country_container").append("div").text(node.country)
	  .attr("class","country")
	  .attr("position","relative");
	  
	  
	      try{
   detail.select(".measure").selectAll(".measure_icon")
	  .data(measures)
	  .enter()
	  .append("img")
	  .attr("class","measure_icon")
	  .attr("src",function(d){return "resources/"+d+".svg";}); 
	}
	catch(err){
	  }
/////////////////////////Preparing data to populate the list////////////////////////
   
    

    try
    {listList1=node.isListedIn;
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
d3.select("#numOfList")
	.text(numOfList);

	try {
    var listAKA=node.AKA;
    numOfAKA=listAKA.length;

    }
catch(err) {
  numOfAKA=0;  
  
}
d3.select("#numOfName")
	.text(numOfAKA);
try {
    var listKA=node.KnownAddress;
    numOfAddress=listKA.length;
  ;
    }
catch(err) { 
   numOfAddress=0;
}

  d3.select("#numOfAddress")
	.text(numOfAddress)

////////////////////////////////////////////////////////////////////
	var listOfList=d3.select("#listList").append("ul")
        .attr("class","ul_list_List")
        .selectAll("li")
        .data(node.isListedIn)
	    .enter()
	    .append("li")
	    .attr("class","listList")
	    .style("font-size", 15 + "px")
	    .text(function(d){return d.Name})
	    .style("text-anchor", "start")
	    .on("click",overlay)
        .on("mouseover",function(d){
           
            if(d.Expiration!=undefined)
            mouseOverList(d.Expiration)
            })
        .on("mousemove",mousemove)
        .on("mouseout",mouseout);


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
	el
	.style("visibility",
	  (el.style("visibility") == "visible") ? "hidden" : "visible")
	.on("click",closeOverlay);;
	
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