module.exports = function(grunt) {

grunt.initConfig({
pkg: grunt.file.readJSON('package.json'),

concat: {
  options: {
    // define a string to put between each file in the concatenated output
    separator: ';'
  },
  dist: {
    // the files to concatenate
    src: ['*.js'],
    // the location of the resulting JS file
    dest: 'dist/<%= pkg.name %>.js'
  }
},

uglify: {
  options: {
    // the banner is inserted at the top of the output
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
  },
  dist: {
    files: {
      'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
    }
  }
},
 connect: {
    server: {
      options: {
        port: 9001,
	keepalive:true
      }
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.registerTask('default', ['concat', 'uglify']);

};;

  var width =d3.select("#associate_info").node().getBoundingClientRect().width/2;
  var height =d3.select("#associate_info").node().getBoundingClientRect().height;
  var IsExpanded=false;  
      
  var margin = {top: -1, right: -1, bottom: -1, left: -1};

  
  var isChosen=0;
  
  var force = d3.layout.force()
      .charge(-7700)
      .linkDistance(70)
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
  
  function reCalculateLayoutWhenResize(){
    if(IsExpanded==false){
   width  = d3.select("#associate_info").node().getBoundingClientRect().width/2;
   height = d3.select("#associate_info").node().getBoundingClientRect().height;
   
      svg
      .attr("width",width)
      .attr("height",height);
       }
    }
  
    
    function expandForceLayout(){
      if(IsExpanded==false){
      d3.select("#associate_info_node").
      style("display","none");

   width  = d3.select("#associate_info").node().getBoundingClientRect().width;
   height = d3.select("#associate_info").node().getBoundingClientRect().height;
      svg
      .attr("width",width)
      .attr("height",height);
      
      d3.select("#visualization")
	.style("width","100%")
	.style("max-width","100%");
      
      d3.select("#trustScore")
      .attr("transform","translate(1290,-14)");
      
      d3.select("#expand_forcelayout")
      .text(">>>");
      IsExpanded=true;
      }
      else{
	collapseForceLayout();
	}
     }
     function collapseForceLayout(){
      
      d3.select("#associate_info_node").
      style("display",null);
      
  width = d3.select("#associate_info").node().getBoundingClientRect().width/2;
  height = d3.select("#associate_info").node().getBoundingClientRect().height;
      svg
      .attr("width",width)
      .attr("height",height);
      
      d3.select("#visualization")
	.style("width","50%")
	.style("max-width","50%");
      
      d3.select("#trustScore")
      .attr("transform","translate(570,-14)");

      d3.select("#expand_forcelayout")
      .text("<<<");
      IsExpanded=false;
     }

    function linkToolTip(link){

    var text=link.attr("type");
        tooltip.text(text);
	tooltip.style("visibility","visible");
  }

  function zoomed() {
//     container.attr("transform", "translate(0,0 )scale(1)");
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
  function trust_to_color(trust,status){
   try{
    if(status=="Inactive")
     return"grey";
   }
   catch(err){
     
  }
   if(trust>=80){
     return "green";
  
     }
   else if(trust>=30 && trust<=79){
     return "yellow";

   }
   else if(trust<=30)  {
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
////////////////////////////Call function on detail.js////////////////////////////////	
	populateDetailPage(node);

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
   
 
   container.attr("transform", "translate(0,0)scale(1)");
   


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
	.on("mouseout", function(d){
	  tooltip
	.style("visibility", "hidden");})
	.on("mousemove",mousemove)
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
	.style("fill", function(d) { return trust_to_color(d.trust,d.status) });
	
	var image_node=node
	.append("image")
	.attr("class","node_image")
	.attr("xlink:href",function(d){return "resources/"+ d.type+ ".svg" ;})
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
	
	      var text = container.append("g").selectAll(".text")
      .data(graph.nodes)
      .enter().append("text")
      .attr("class","text_svg")
      .attr("dy", ".35em")
      .style("font-size", 13 + "px")

      text.text(function(d) { return d.name; })
      .style("text-anchor", "middle");	
	
	
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

//     node.append("title")
// 	.text(function(d) { return d.name; });
	
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
      .attr("id","trustScore")
      .attr("transform","translate(570,-14)");
      
      trust.append("rect")
      .attr("width",60*graph.level_trust.length)
      .attr("height",27*graph.level_trust.length)
      .style("fill","#eaf0fa");
      
  var trust_draw=trust.selectAll()
      .data(graph.level_trust)
      .enter();
      
      trust_draw.append("text")
      .attr("transform",function(d,i){return "translate(22,"+25*(i+1)+")" })
      .text(function(d) { return d.Message})
      .style("fill","black")
      .style("dominant-baseline","central");
      
           trust_draw.append("circle")
      .attr("r",10)
      .attr("transform",function(d,i){return "translate(10,"+25*(i+1)+")" })
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

    try{
      statusColor="red";
    tooltip.style("visibility", "visible");
    tooltip.html(node.name+
    "<br>Type: "+node.type+
    "<br>Status: <span style='color: "+statusColor+"'>"+node.status+"</span>"+
    "<br>Listed in "+node.isListedIn.length+" Sanction Lists");
        }
        catch(err){
	tooltip.style("visibility", "visible");
	tooltip.html(node.name);

	}
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


	link.attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; })
	   /* .style("stroke",function(d){if(d.linktype=="Subsidiary") return "red";})*/ ;

	  node.attr("transform", function(d) { 
	    return "translate(" + d.x + "," + d.y + ")"; });
	  
	text.attr("x", function(d) { return d.x; })
	    .attr("y", function(d) { return d.y+38; });

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
;var detail=d3.select("#detail_info");
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
  
  //////////////////////Populate content in to detail div/////////////////// 
         d3.selectAll(".detail_name").remove();
         d3.selectAll(".detail_address").remove();
         d3.selectAll(".ul_list_List").remove();
	 d3.selectAll(".measure_icon").remove();
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