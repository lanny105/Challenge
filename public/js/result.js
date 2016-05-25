function printTerms(id, obj) {

      $('#'+id).empty();
      $('#'+id).append("<tr><th>Order</th><th>streamCreator</th><th>number of calling</th><th>sum of calling time</th></tr>");

      
      if (obj.length>0) {
        $('#'+id+"_pro").empty();
      }
      else {
        $('#'+id+"_pro").html('No data qualified...');
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
    }



	

    $(document).ready(function () {
    	// var name = "{{ name }}";
          $.ajax({
            url: 'process_get', 
            type: 'GET',
            data: {Filename: Filename, Nums: -1}, // The form with the file inputs.


            success: function(returnval){

              var c = JSON.parse(returnval); 
              printTerms('table1',c[3]);
              printTerms('table2',c[2]);
              printTerms('table3',c[1]);
              printTerms('table4',c[0]);

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

