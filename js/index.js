var tableH = 5; //set table size;
var tableW = 5; //set table size

$( document ).ready(function() {
		removeCookies();
		createTable();

		$( "#console_command" ).focus();

		$("#console_enter").click(function(){
			var command_text = $("#console_command").val();
			$("#console_history").append(command_text + "<br />");

			checkCommand(command_text.toUpperCase());

			$("#console_command").val("");
			$( "#console_command" ).focus();
		});

		$('#console_command').keypress(function(event){
		    var keycode = (event.keyCode ? event.keyCode : event.which);
		    if(keycode == '13'){
		        var command_text = $("#console_command").val();
				$("#console_history").append(command_text + "<br />");

				checkCommand(command_text.toUpperCase());

				$("#console_command").val("");
				$( "#console_command" ).focus();
		    }
		});
})

function createTable(){
	for (var H = tableH-1; H >= 0; H--) {
		$(".main-table").append('<tr id="tr_'+H+'">');
			for (var W = 0; W < tableW; W++) {
				var html = "<td name='td_"+W+"'>"+"</td>";
				$(".main-table #tr_"+H).append(html);
			}
		$(".main-table").append('</tr>');
	}
}

function checkCommand(comm){
	var myscroll = $('#console_history');
	//check 'place'
	 if (comm.indexOf(' ')>=0){
	 	var res = check_place(comm);
		if (res == "-9") {
  			myscroll.scrollTop(myscroll.get(0).scrollHeight);
	 		return;
	 	}else if (res == '-4') {
	 		$("#console_history").append(":Please key in {SOUTH / EAST / NORTH / WEST} after digit"+ "<br />");
  			myscroll.scrollTop(myscroll.get(0).scrollHeight);
	 		return;
	 	}else if(res == "-8"){
	 		$("#console_history").append(":Out of range"+ "<br />");
  			myscroll.scrollTop(myscroll.get(0).scrollHeight);
	 		return;
	 	}else{
		 	update_place(res);
	 	}
	 }
	var res = check_robot();

	switch( comm.toUpperCase() ){
	    case "MOVE":
	    	if (res)
	    	update_move();
	    break;
	    case "REPORT":
	    	if (res)
	    	generate_report();
	    break;
	    case "LEFT":
	    	if (res)
	    	update_direction(0);;
	    break;
	    case "RIGHT":
	    	if (res)
	    	update_direction(1);
	    break;
	    
	}
  	myscroll.scrollTop(myscroll.get(0).scrollHeight);
}

function check_place(comm){
	try{
		var res = comm.split(" ");
		if (res[0].toUpperCase() != "PLACE") {
	    	$("#console_history").append(":Missing command text, Please key in 'PLACE {position X, position Y, direction}' "+ "<br />");
			return -9;
		}

		var x = res[1].split(",")[0];
		var y = res[1].split(",")[1];
		var f = res[1].split(",")[2];
		f = f.toUpperCase();

		if (! ($.isNumeric(x)) || ! ($.isNumeric(y)) )
			return -9;

		if ( x > tableH-1 || y > tableW-1 || x < 0 || y < 0)
			return -8;

		if ( !(f == "NORTH") && !(f ==  "SOUTH") && !(f == "EAST")  && !(f == "WEST"))
			return -4;

		return res[1];
	}catch(err){
		return -9;
	}
}

function check_robot(){
	var res = true;	
	var px = getCookie("placeX");
	if (px == "" || px == null || px == "undifined" ) {
		res = false;
	}
	return res
}

function update_place(res){
	var placeX;
	var placeY;
	var placeF;

	placeX = res.split(",")[0];
	placeY = res.split(",")[1];
	placeF = res.split(",")[2];

	$(".main-table tr td").removeClass();
	$(".main-table tr td").css("border","1px white solid");


	var trH = ".main-table #tr_"+ placeX;
	$(trH + " td[name*='td_"+placeY+"'").addClass("robot robot_"+placeF);
	

	update_directionView(placeX,placeY,placeF);

	setCookie("placeX", placeX,1);
	setCookie("placeY", placeY,1);
	setCookie("placeF", placeF.toUpperCase(),1);
}

function update_directionView(px,py,pf){
	var border;
	switch(pf.toUpperCase()){
		case "NORTH":
			border = "border-top";
	    break;
	  	case "SOUTH":
			border = "border-bottom";
	    break;
	    case "EAST":
			border = "border-right";
	    break;
	    case "WEST":
			border = "border-left";
	    break;
	}
	var trH = ".main-table #tr_"+ px;
	$(trH + " td[name*='td_"+py+"'").css(border,"cyan solid 1px");
	$(trH + " td[name*='td_"+py+"'").removeClass().addClass("robot robot_"+pf);
}

function update_direction(turn){
	var px = getCookie("placeX");
	var py = getCookie("placeY");
	var pf = getCookie("placeF");
	
	var dir = ["NORTH","EAST","SOUTH","WEST"];

	$.each( dir, function( key, value ) {
		if (pf == value) {
			console.log(key)
			if (turn == 1) {
				var i = 0;
				if (key != 3)
					i = key+1;

				pf = dir[i];
			}else if(turn == 0){
				var i = 3;
				if (key != 0)
					i = key-1;

				pf = dir[i];
			}

			return false;
		}
	});
	$(".main-table tr td").css("border","1px white solid");
	update_directionView(px,py,pf);
	setCookie("placeF", pf.toUpperCase(),1);
}

function update_move(){
	var px = getCookie("placeX");
	var py = getCookie("placeY");
	var pf = getCookie("placeF");
	
	var res = check_fallen(px,py,pf);
	if (!res) {//moving object
		$(".main-table tr td").removeClass();
		$(".main-table tr td").css("border","1px white solid");

		if (pf == "EAST") {
			py++;
		}else if( pf == "SOUTH"){
			px--;
		}else if( pf == "WEST"){
			py--;
		}else if( pf == "NORTH"){
			px++;		
		}

		var trH = ".main-table #tr_"+ px;
		$(trH + " td[name*='td_"+py+"'").addClass("robot robot_"+pf);
		update_directionView(px,py,pf);

		setCookie("placeX", px,1);
		setCookie("placeY", py,1);
		setCookie("placeF", pf.toUpperCase(),1);
	}else{
		$("#console_history").append(":opps... One more step will fall." + "<br />");
	}
}

function generate_report(){
	var px = getCookie("placeX");
	var py = getCookie("placeY");
	var pf = getCookie("placeF");

	$("#console_history").append("Output : " +px+","+py+","+pf + "<br />");
}

function check_fallen(px,py,pf){
	var fall = false;
	if (pf == "EAST") {
		if (py == tableW-1) {
			fall = true;
		}
	}else if( pf == "SOUTH"){
		if (px == 0) {
			fall = true;
		}
	}else if( pf == "WEST"){
		if (py == 0) {
			console.log(9292929)
			fall = true;
		}
	}else if( pf == "NORTH"){
		if (px == tableH-1) {
			fall = true;
		}		
	}

	return fall;
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function removeCookies() {
	var res = document.cookie;
    var multiple = res.split(";");
    for(var i = 0; i < multiple.length; i++) {
    	var key = multiple[i].split("=");
        document.cookie = key[0]+" =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
    }
}
