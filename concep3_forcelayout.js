var width = 720,
    height =750;
      
var margin = {top: -5, right: -5, bottom: -5, left: -5};
  
//   var tip = d3.tip()
//   .attr('class', 'd3-tip')
// //   .offset(function(d) {
// //     var coordinates = [0, 0];
// //     coordinates = d3.mouse(this);
// //     var x = coordinates[0];
// //     var y = coordinates[1];
// //     return x/2,y;
// //   })
//   .offset([-50, 0])
//   .direction('e')
//   .html(function(d) {
//     return "<strong>Frequency:</strong> <span style='color:red'>" + "20" + "</span>";
//   })
  var isChosen=0;
  var force = d3.layout.force()
      .charge(-1700)
      .linkDistance(90)
      .size([width, height]);
      
  var drag = force.drag()
  .origin(function(d) { return d; })
  .on("dragstart", dragstarted)
  .on("drag", dragged)
  .on("dragend", dragended);
      
  var zoom = d3.behavior.zoom()
      .scaleExtent([0.7, 6])
      .on("zoom", zoomed)
      

  var svg = d3.select("body").select("#associate_info")
  .	select("#visualization").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class","svg")
      .call(zoom)
      .on("dblclick.zoom", null);
    
  var container = svg.append("g");

//   function linkToolTip(d){
//     
//      var coordinates = [0, 0];
//      coordinates = d3.mouse(this);
//      var x = coordinates[0];
//      var y = coordinates[1];
//      
//         var tooltip = container
//         .append("text")
//         .text("Yahoo")
//         .attr("x", x+10)
//         .attr("y", y+10)
// 	.attr("text-anchor", "middle")
//         .attr("id", "tooltip");
// 
//     
//   }
  
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
      
      
  d3.json("pst2.json", function(error, graph) {
    if (error) throw error;
    
    root=graph.nodes[0];
      root.x = width / 2;
      root.y = height / 2;
      root.fixed = true;
      
  //graph.links.forEach(function(d, i) {
  //       d.source = isNaN(d.source) ? d.source : graph.nodes[d.source];
    //      d.target = isNaN(d.target) ? d.target : graph.nodes[d.target];
  //   });
      
  var linkedByIndex = {};
      graph.links.forEach(function(d) {
	  linkedByIndex[d.source + "," + d.target] = true;
      });
  
    /*container.call(tip);*/
    
    var link = container.append("g").selectAll(".link")
	.data(graph.links)
      .enter().append("line")
	.attr("class", "link")
	.on("mouseover",function(d) {linkToolTip(d);
	  
        })
	.on("mouseout", function(d) { d3.select("#tooltip").remove();})
	.style("stroke-width", function(d) { return 6 });


    var node = container.append("g").selectAll(".node")
	.data(graph.nodes)
	.enter()
	.append("image")
	.attr("xlink:href",function(d){return d.type+ ".svg" ;})
	.attr("class", "node")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return "24px" })
	.attr("height",function(d) { return "24px" })
	.attr("isChosen", "no")
	.call(force.drag)
	.on("mouseover",mouseover)
	.on("mouseout",mouseout)
	.on("click",click)
	.on("dblclick.zoom", null)
	.on("dblclick",dblclick);
	
      var text = container.append("g").selectAll(".text")
      .data(graph.nodes)
      .enter().append("text")
      .attr("class","text_svg")
      .attr("dy", ".35em")
      .style("font-size", 10 + "px")    
      
      text.text(function(d) { return d.name; })
      .style("text-anchor", "left");
	  
    force
	.nodes(graph.nodes)
	.links(graph.links)
	.start(); 
      
    node.append("title")
	.text(function(d) { return d.name; });
	
    function mouseout(node) {
    text.style("font-weight", "normal");
    link.style("stroke","#999");
    }
    
    function mouseover(node) {
    text.style("font-weight", function(o){
    return isConnected(node, o) ? "bold" : "normal";});
    
    link.style("stroke", function(o) {
      return o.source.index == node.index || o.target.index == node.index ? "red" : "#999"});
    }
    function click(node) {
    //root.fixed = false;
    
  if (d3.event.defaultPrevented) return; 
	  d3.selectAll(".node")
	.attr("width", "24px")
	.attr("height", "24px")	;
	  
   translateBeforeChose(node.x,node.y);
    
  d3.select(this)
	.attr("isChosen", "yes")
	.transition()
        .duration(750)
	.attr("x", function(d) {return d.x-24})
	.attr("y", function(d) {return d.y-24})
        .attr("width", "35px")
	.attr("height", "35px")	
        .style("fill", "lightsteelblue");
	
	d3.select("#list").selectAll("li").
	style("background",function(d){ 
	  if(node.id== d.id) 
	  return "#ffa366";
	  else
	    return "#cce5ff";
	});
          
    }
    
    function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
	}
	
      function dblclick(node) {

      root.fixed = false;
  }
 
  render();
  function render(){
      force.on("tick", function() {
	link.attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; });

 	node.attr("x", function(d) {return d.x-12})
 	    .attr("y", function(d) {return d.y-12});
// 	    .attr("transform", function(d){return "translate(" + d.width/2 + "," + -d.height/2 + ")"});
	    
// 	d3.select("image")
// 	   .attr("x", function(d) {return d.x+d.width/2})
// 	   .attr("y", function(d) {return d.y+d.height/2});
	    
	text.attr("x", function(d) { return d.x+26; })
	    .attr("y", function(d) { return d.y; });
	
	    container.select("#tooltip")
	.attr("x", function(d) { return d.x+20; })
	.attr("y", function(d) { return d.y; });
	
    });
      }
  });
