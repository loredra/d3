
  var width =d3.select("#associate_info_node").node().getBoundingClientRect().width;
  var height =d3.select("#associate_info_node").node().getBoundingClientRect().height-26;
    
      
  var margin = {top: -1, right: -1, bottom: -1, left: -1};

  var trustData={red: "Bad business", yellow: "Shady connection", green:"Safe for now"};
  
  var isChosen=0;
  
  var force = d3.layout.force()
      .charge(-1700)
      .linkDistance(120)
      .size([width, height]);
      
  var drag = force.drag()
  .origin(function(d) { return d; })
  .on("dragstart", dragstarted)
  .on("drag", dragged)
  .on("dragend", dragended);
      
  var zoom = d3.behavior.zoom()
      .scaleExtent([0.4, 6])
      .on("zoom", zoomed)


  var svg = d3.select("body").select("#associate_info")
      .select("#visualization").append("svg")
      .attr("class","svg")
      .attr("width",width)
      .attr("height",height)
      .call(zoom)
      .on("dblclick.zoom", null);
    
  var container = svg.append("g");
    
    function linkToolTip(link){
     
    var x1 = parseFloat(link.attr("x1"));
    var x2 = parseFloat(link.attr("x2"));
    var y1 = parseFloat(link.attr("y1"));
    var y2 = parseFloat(link.attr("y2"));
    var text=link.attr("type");
        
    var x=(x1+x2)/2;
    var y=(y1+y2)/2;
      
         var tooltip = container
         .append("title")
         .text(text)
	 .attr("class","tooltip")
	 .style("background-color","black")
	 .style("stroke","black")
	 .style("color","white")
         .attr("x", x+50)
         .attr("y", y+10)
 	 .attr("text-anchor", "middle")
         .attr("id", "tooltip");  
  }
  
  function zoomed() {
    container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }
  function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
    
  }

  function dragged(d) {
  root=d;
    root.fixed=true;
    d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
  }

  function dragended(d) {
    d3.select(this).classed("dragging", false);

  }

   function translateBeforeChose(x,y){
  var dcx = (width/2-x*zoom.scale());
  var dcy = (height/2-y*zoom.scale());
  zoom.translate([dcx,dcy]);
  
  container
    .transition()
    .duration(750)
    .attr("transform", "translate("+ dcx + "," + dcy  + ")scale(" + zoom.scale() + ")");

  }
  function trust_to_color(trust){
    
   if(trust>=80){
     return "green";
  
     }
   if(trust>=30 && trust<=79){
     return "yellow";

   }
   if(trust<=30)  {
     return "red";
     
  }  
  }
  function clickImage(node) {
    //root.fixed = false;
     
  if (d3.event.defaultPrevented) return; 
	 d3.selectAll(".node")
	.attr("isChosen","no")
	.select(".node_image")
	.transition()
	.attr("x", -12)
	.attr("y", -12)
	.attr("width", "24px")
	.attr("height", "24px");
	
    vis=d3.selectAll(".highlight_circle");
    vis.attr("transform", "scale(0.1,0.1)")
       .attr("opacity",0);
  
///////////////Translte selected node to middle////////////////////////	
  translateBeforeChose(node.x,node.y);
  
////////////////////////////Set the node with isChosen yes to bigger/////////////
  d3.select(this)
	.attr("isChosen", "yes")
	.select(".node_image")
	.transition()
	.duration(750)
	.attr("x",-20)
	.attr("y",-20)
        .attr("width", "40px")
	.attr("height", "40px")
        .style("fill", "lightsteelblue");

  d3.select(this)
	.select(".highlight_circle")
	.transition()
	.duration(450)
	.attr("transform", "scale(1,1)" )
	.attr("opacity",0.9); 
	
///////////////////Color the coressponding list of name////////////////////////////

	var chosenItem=d3.select("#list")
	.selectAll("li")
	.filter(function(d){
	  return node.id== d.id});




     d3.select("#list")
	.property("scrollTop",chosenItem.attr("id").toString().replace('index','')*19)
	.selectAll("li")
	.style("background",function(d){
	  if(node.id== d.id)
	  return "#ffa366";
	  else
	    return "#cce5ff";
	});
//////////////////////////////////////////////////////////////////7
    d3.select(".detail_name").remove();
    d3.select(".detail_address").remove();
    d3.selectAll(".ul_list_List").remove();

   detail.select("#name").append("div").text(node.name)
	  .attr("class","detail_name")
	  .attr("position","relative");

    detail.select("#address").append("div").text(node.address)
	  .attr("class","detail_address")
	  .attr("position","relative");

      var listList;
      var listAKA;
       try {

       listAKA=node.AKA.toString().split(",");
            }
            catch(err) {  }
          try {

     listList=node.isListedIn.toString().split(",");
      numOfList=listList.length;
            }
            catch(err) { numOfList=0;  }



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
	    .style("text-anchor", "start")
	    .on("click",overlay)
        ;
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


  d3.json("pst2.json", function(error, graph) {
    if (error) throw error;

     root=graph.nodes[0];
       root.x = width / 2;
       root.y = height / 2;
      root.fixed = true;

  graph.links.forEach(function(d, i) {
         d.source = isNaN(d.source) ? d.source : graph.nodes[d.source];
          d.target = isNaN(d.target) ? d.target : graph.nodes[d.target];
     });
  tooltip=d3.select(".tooltip");
  var linkedByIndex = {};
      graph.links.forEach(function(d) {
	  linkedByIndex[d.source + "," + d.target] = true;
      });

    /*container.call(tip);*/

   var myScale = d3.scale.linear().domain([0, 100]).range([0, 2 * Math.PI]); 
 
   var arc = d3.svg.arc()
   .innerRadius(43) 
   .outerRadius(46)
   .startAngle(myScale(0)) 
   .endAngle(myScale(100));
   

      var text = container.append("g").selectAll(".text")
      .data(graph.nodes)
      .enter().append("text")
      .attr("class","text_svg")
      .attr("dy", ".35em")
      .style("font-size", 10 + "px")

      text.text(function(d) { return d.name; })
      .style("text-anchor", "start");

    var link = container.append("g").selectAll(".link")
	.data(graph.links)
	.enter().append("line")
	.attr("class", "link")
	.attr("x1",function(d){ return d.source.x; })
	.attr("y1",function(d){ return d.source.y; })
	.attr("x2",function(d){ return d.target.x; })
	.attr("y2",function(d){ return d.target.y; })
	.attr("type",function(d){ return d.linktype; })
	.on("mouseover",function(d){
	  linkToolTip(d3.select(this));
	})
	.on("mouseout", function(d){d3.selectAll("#tooltip").remove();})
	.style("stroke-width", function(d) { return 6 })
	.style("marker-end",  "url(#resolved)");
      
	

      
    var marker = container.append("g").selectAll("marker")
      .data(["suit", "licensing", "resolved"])
      .enter().append("marker")
      .attr("id", function(d) { return d; })
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 2)
      .attr("markerHeight", 2)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("stroke", "#4679BD")
      .style("opacity", "0.6");

	var node = container.append("g").selectAll(".node")
	.data(graph.nodes)
	.enter()
	.append("g")
	.attr("id", function(d) { return d.id})		
	.attr("class", "node")
	.attr("name",function(d){return d.name; })
	.attr("address",function(d){return d.address; })
	.attr("isListedIn",function(d){if (d.isListedIn!=null) return d.isListedIn; 
	  else return ""
	  })
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return "24px" })
	.attr("height",function(d) { return "24px" })
	.attr("isChosen", "no")
	.attr("name",function(d){return d.name; })
	.call(force.drag)
	.on("mouseover",mouseover)
	.on("mousemove",mousemove)
	.on("mouseout",mouseout)
	.on("click",clickImage)
	.on("dblclick.zoom", null)
	.on("dblclick",dblclick);
	

	
	var trust_cirlce=node
	.append("circle")
	.attr("r",26)
	.style("fill", function(d) { return trust_to_color(d.trust) });
	
	var image_node=node
	.append("image")
	.attr("class","node_image")
	.attr("xlink:href",function(d){return d.type+ ".svg" ;})
	.attr("x",-12)
	.attr("y",-12)
	.attr("width", function(d) { return "24px" })
	.attr("height",function(d) { return "24px" });	
	
	var vis=node
	.append("path")
	.attr("transform",function(d) {
	  return "scale(0.1,0.1)" })
	.attr("class", "highlight_circle")
	.attr("d",arc)
	.attr("opacity",0);
	
		
	
	
    force
	.nodes(graph.nodes)
	.links(graph.links)
	.start();
    

    var text_link = container.append("g").selectAll(".text_link_svg")
      .data(force.links())
      .enter().append("text")
      .text(function(d) { return d.linktype; })
      .attr("class","text_link_svg")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size", 10 + "px");
    
    change();
    


    node.append("title")
	.text(function(d) { return d.name; });
	
//     info_color_container=d3.select(".svg").append("g")
//       .attr("class",".info_color_container");
//       
//       info_color_container.selectAll("g")
//       .data(trustData)
//       .enter()
//       .append("g")
//       .attr("class",".info_color_list")
//       .attr("data-legend",function(d) { return d.name})
  var trust=d3.select(".svg").append("g")
      .attr("transform","translate(570,0)");
      
      trust.append("rect")
      .attr("width","180px")
      .attr("height","110px")
      .style("fill","#eaf0fa");
      
  var trust_draw=trust.selectAll()
      .data(graph.level_trust)
      .enter();
      
      trust_draw.append("text")
      .attr("transform",function(d,i){return "translate(22,"+33*(i+1)+")" })
      .text(function(d) { return d.Message})
      .style("fill","black");
      
           trust_draw.append("circle")
      .attr("r",10)
      .attr("transform",function(d,i){return "translate(10,"+30*(i+1)+")" })
      .style("fill",function(d) { return d.color});
    
    function mouseout(node) {
    text.style("font-weight", "normal");
    link.style("stroke","#999");
    tooltip
    .style("visibility", "hidden");
    }

       function mousemove(node) {
     tooltip.style("top", (d3.event.pageY + 16) + "px")
            .style("left", (d3.event.pageX + 16) + "px");
}

    function mouseover(node) {
    text.style("font-weight", function(o){
    return isConnected(node, o) ? "bold" : "normal";});

    link.style("stroke", function(o) {
      return o.source.index == node.index || o.target.index == node.index ? "red" : "#999"});
    
    tooltip.style("visibility", "visible");
            
    }
    
    /////Checkbox///////////////////////////////////////////////////////////
    d3.select("#node_check_box").on("change", change);
    d3.select("#link_check_box").on("change", change);
    function change() {
        if(d3.select('#node_check_box').property('checked')==false)
        isDisplay="initial";
        else
        isDisplay="none";
    d3.selectAll(".text_svg")
    .style("display",isDisplay); 
   
    if(d3.select('#link_check_box').property('checked')==false)
        isDisplay="initial";
        else
        isDisplay="none";
    d3.selectAll(".text_link_svg")
    .style("display",isDisplay);                   }
    ///////////////////////////////////////////////////////////////////////

    function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
	}
	
      function dblclick(node) {

      root.fixed = false;
  }
 
  render();
  function render(){
      force.on("tick", function() {
	
	text_link.attr("x", function(d) { return (d.source.x+d.target.x)/2 + 3; })
	    .attr("y", function(d) { return (d.source.y+d.target.y)/2; });

	text.attr("x", function(d) { return d.x+26; })
	    .attr("y", function(d) { return d.y; });

	link.attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; })
	   /* .style("stroke",function(d){if(d.linktype=="Subsidiary") return "red";})*/ ;

	  node.attr("transform", function(d) { 
	    return "translate(" + d.x + "," + d.y + ")"; });

// 	    .attr("transform", function(d){return "translate(" + d.width/2 + "," + -d.height/2 + ")"});
	    
// 	d3.select("image")
// 	   .attr("x", function(d) {return d.x+d.width/2})
// 	   .attr("y", function(d) {return d.y+d.height/2});
	    

// 	  container.select("#tooltip")
// 	.attr("x", function(d) { return d.x+20; })
// 	.attr("y", function(d) { return d.y; });
	
    });
      }
  });
