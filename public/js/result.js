function printTerms(id, obj) {

      $('#'+id).empty();
      // $('#'+id).append("<tr><th>Order</th><th>streamCreator</th><th>number of calling</th><th>sum of calling time</th></tr>");

      $('#'+id+'_myPager').empty();
      
      if (obj.length>0) {
        $('#'+id+"_pro").empty();
      }
      else {
        $('#'+id+"_pro").html('No data qualified...');
        return;
      }


      for (var i = 0; i < obj.length; i++) {
        // console.log(obj[i].streamCreator);

        var x = obj[i].sumofcallingtime;
        var d = moment.duration(x, 'seconds');
        var hours = Math.floor(d.asHours());
        var mins = Math.floor(d.asMinutes()) - hours * 60;

        var seconds = (x - hours*3600-mins*60).toFixed(2);


        $('#'+id).append("<tr><td>"+(i+1)+"</td><td>"+obj[i].streamCreator+"</td><td>"+obj[i].numberofcalling+"</td><td>"+hours + "h/" + mins + "m/" +seconds +"s"+ "</td></tr>");
      };


      $('#'+id).pageMe({pagerSelector:'#'+id+'_myPager',showPrevNext:true,hidePageNumbers:false,perPage:20,numbersPerPage:5});


}


function draw(id, obj) {



  $('#'+id).empty();


  if (obj.length == 0) {

    return
  };



  var margin = {top: 20, right: 20, bottom: 30, left: 20},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10, "times");

  var svg = d3.select('#'+id).append("svg")
      .attr("width", $("svg").parent().width())
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  x.domain(obj.map(function(d) { return d.streamCreator; }));
  y.domain([0, d3.max(obj, function(d) { return d.numberofcalling; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("# calling times");

  svg.selectAll(".bar")
      .data(obj)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.streamCreator); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.numberofcalling); })
      .attr("height", function(d) { return height - y(d.numberofcalling); });

}
$.fn.pageMe = function(opts){
    var $this = this,
        defaults = {
            perPage: 7,
            showPrevNext: false,
            numbersPerPage: 5,
            hidePageNumbers: false
        },
        settings = $.extend(defaults, opts);
    
    var listElement = $this;
    var perPage = settings.perPage; 
    var children = listElement.children();
    var pager = $('.pagination');
    
    if (typeof settings.childSelector!="undefined") {
        children = listElement.find(settings.childSelector);
    }
    
    if (typeof settings.pagerSelector!="undefined") {
        pager = $(settings.pagerSelector);
    }
    
    var numItems = children.size();
    var numPages = Math.ceil(numItems/perPage);

    pager.data("curr",0);
    
    if (settings.showPrevNext){
        $('<li><a href="#" class="prev_link">«</a></li>').appendTo(pager);
    }
    
    var curr = 0;
    while(numPages > curr && (settings.hidePageNumbers==false)){
        $('<li><a href="#" class="page_link">'+(curr+1)+'</a></li>').appendTo(pager);
        curr++;
    }
  
    if (settings.numbersPerPage>1) {
       $('.page_link').hide();
       $('.page_link').slice(pager.data("curr"), settings.numbersPerPage).show();
    }
    
    if (settings.showPrevNext){
        $('<li><a href="#" class="next_link">»</a></li>').appendTo(pager);
    }
    
    pager.find('.page_link:first').addClass('active');
    pager.find('.prev_link').hide();
    if (numPages<=1) {
        pager.find('.next_link').hide();
    }
    pager.children().eq(1).addClass("active");
    
    children.hide();
    children.slice(0, perPage).show();
    
    pager.find('li .page_link').click(function(){
        var clickedPage = $(this).html().valueOf()-1;
        goTo(clickedPage,perPage);
        return false;
    });
    pager.find('li .prev_link').click(function(){
        previous();
        return false;
    });
    pager.find('li .next_link').click(function(){
        next();
        return false;
    });
    
    function previous(){
        var goToPage = parseInt(pager.data("curr")) - 1;
        goTo(goToPage);
    }
     
    function next(){
        goToPage = parseInt(pager.data("curr")) + 1;
        goTo(goToPage);
    }
    
    function goTo(page){
        var startAt = page * perPage,
            endOn = startAt + perPage;
        
        children.css('display','none').slice(startAt, endOn).show();
        
        if (page>=1) {
            pager.find('.prev_link').show();
        }
        else {
            pager.find('.prev_link').hide();
        }
        
        if (page<(numPages-1)) {
            pager.find('.next_link').show();
        }
        else {
            pager.find('.next_link').hide();
        }
        
        pager.data("curr",page);
       
        if (settings.numbersPerPage>1) {
          $('.page_link').hide();
          $('.page_link').slice(page, settings.numbersPerPage+page).show();
      }
      
        pager.children().removeClass("active");
        pager.children().eq(page+1).addClass("active");
    
    }
};




	

    $(document).ready(function () {
    	// var name = "{{ name }}";
          $.ajax({
            url: 'process_get', 
            type: 'GET',
            data: {Filename: Filename, Nums: -1}, // The form with the file inputs.


            success: function(returnval){


            var c = JSON.parse(returnval); 
            printTerms('table1',c[3]);
            // draw('chart1',c[3]);

            printTerms('table2',c[2]);
            // draw('chart2',c[2]);
            printTerms('table3',c[1]);
            // draw('chart3',c[1]);
            printTerms('table4',c[0]);
            // draw('chart4',c[0]);

            }



          }).fail(function(){
            console.log("An error occurred, the files couldn't be sent!");
          });


          $("#numberofDays").keypress(function (e) {
           //if the letter is not digit then display error and don't type anything
           if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
              //display error message
              $("#errmsg").html("not Digit").show().fadeOut("slow");
                     return false;
          }
         });


          $("#myform").submit(function() {  
            $.ajax({
                url: "process_get",
                type: 'GET',
                data: {
                  Filename: Filename, Nums:$('#numberofDays').val()
                },

                success: function(returnval){

                // $('#test').html(returnval);

                  var c = JSON.parse(returnval); 

                  printTerms('table5',c[0]);
                }





              }).fail(function(){
                console.log("An error occurred, the files couldn't be sent!");
              });
            });

    });

