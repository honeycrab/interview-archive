// TO DO: -buffer a new AJAX query with tweets
//                  add button on each line to "retranslate" tweet
//        -allow user to specify guest name via optional text field
//        -add array of adjectives
//        -allow user to reorder responses (might require attention first)

$(function(){

	var loadData = function() {
		var p1 = Tweet.load(greetingSearch);
		var p2 = Tweet.load(Tweet.search);

		Promise.all([p1, p2])
			.then(function(results) {
	     		// we only get here if ALL promises fulfill
	     		Tweet.greeting = results[0];
	     		Tweet.storage = results[1];
	     		
	     		Tweet.clear();
				//display introductory remarks
				Tweet.display(Tweet.interviewer(0), "interviewer");
				Tweet.display(Tweet.greeting[0], "guest");

				//display conversation based on search term
				for(var i=1; i < Tweet.storage.length; i++) {
					console.log("i = " + i);
					Tweet.display(Tweet.interviewer(i), "interviewer");
					Tweet.display(Tweet.storage[i], "guest");
				}
				console.log(Tweet.storage);

	  		})
  			.catch(function(err) {
			    // Will catch failure of first failed promise
			    console.log("Failed:", err);
  			});
	}

  	greetingSearch = "nice to meet you";
	goodbyeSearch = "goodbye";

	//enter button works as submit
	document.getElementById("search-field").addEventListener("keyup", function(event) {
    	if (event.keyCode == 13) {
        	document.getElementById("search-button").click();
    	}
	});

	//onclick search twitter api for search term, and display them
	document.getElementById("search-button").addEventListener("click", function(){

		Tweet.search = document.getElementById("search-field").value;

		loadData();
	});


	Tweet = {

		storage: "",
		search: "",
		greeting: "",
		goodbye: "",
		guestName: "Rigel",
		backup: "",

		removeSubString: function(text, excise) {

			console.log("removeSubString tried to remove " + excise);
			console.log("from : " + text);

			var output = text.replace(excise, "");

			console.log("and returned: " + output);
			return output;
		},

		//removes RTs and @s and # from tweet
		removeTrappings: function(text) {

			var filterCue = "";
			var endCue = "";

			var output = text;

			//removes RT designator from beginning of tweet if its there
			if (output.indexOf("RT") == 0) {
				filterCue = "RT";
				endCue = ":";

				output = Tweet.removeSubString(output, output.substring(output.indexOf(filterCue), output.indexOf(endCue)));
			}

			//this can be improved

			while (output.indexOf("#") >= 0) {
				output = Tweet.removeSubString(output, Tweet.getSubString(output, "#"));
			}

			while (output.indexOf("@") >= 0) {
				output = Tweet.removeSubString(output, Tweet.getSubString(output, "@", " "));
			}

			while (output.indexOf("htt") >= 0) {
				output = Tweet.removeSubString(output, Tweet.getSubString(output, "htt", " "));

			}

			while (output.indexOf("amp;") >= 0) {
				output = Tweet.removeSubString(output, Tweet.getSubString(output, "amp;", ";"));
			}			

			return output;
		},


		//problem area: loops infinitely when it finds a url? 
		getSubString: function(text, getFrom, getUntil) {

			if (text.indexOf(getFrom) > -1) {
				var startPos = text.indexOf(getFrom);
				var endPos = text.indexOf(getUntil, startPos);
				if (endPos == -1) {
					endPos = text.length;
				}

				else { endPos += 1; }
				
			}
				var segment = "";

				getUntil ? segment = text.substring(startPos, endPos) : segment = text.charAt(startPos);

				return segment;
		},

		display: function(text, person) {

			var node = "";
			person == "interviewer" ? node = document.createTextNode(text) : node = document.createTextNode(Tweet.guestName + ": " + Tweet.removeTrappings(text));
			node = Tweet.format(node);
			person == "interviewer" ? node.className="interviewer" : node.className="guest";
			console.log(node);
			var element = document.getElementById("tweets-container");

			element.appendChild(node);
		},

		interviewer: function(line) {

			var name = "Interviewer";
			var adj = "cloud-based";
			switch (line) {
			    case 0:
			        return name + ": Hello, I am here with " + Tweet.guestName + ". Thank you for joining us today.";
			        break;
			    case 1:
			    	return name + ": My pleasure! Let's jump right into it... " + Tweet.search + "... we all know it... we all love it... what can you tell us about it?";
			        break;
			    case 2:
			        return name + ": Aha! I knew it! What do find most interesting about " + Tweet.search + "?";
			        break;
			    case 3:
			        return name + ": Interesting indeed... but how do you reconcile that with the tendency of " + Tweet.search + " to keep on surprising us?";
			        break;
			    case 4:
			        return name + ": It says in my notes here that you have a particular interest in " + adj + " " + Tweet.search + ". Can you elaborate?";
			        break;
			    case 5:
			        return name + ": It sounds like " + Tweet.search + " is here to stay. Thank you again for granting us this interview";
			        break;
			    case 6:
			        
			}

		},

		format: function(textnode) {

			var textContainer = document.createElement("p");
			textContainer.appendChild(textnode);

			return textContainer;
		},

		clear: function() {

			var tweetNode = document.getElementById("tweets-container");
			while (tweetNode.hasChildNodes()){
    			tweetNode.removeChild(tweetNode.lastChild);
			}
		},

		up: function(i) {
			if (i > 0) {
				var swap = tweetArr[i];
				tweetArr[i] = tweetArr[i-1];
				tweetArr[i-1] = swap;
			}
			else {
				alert("tweet already at top");
			}
		},

		down: function(index) {

		},

		//removing this and uncommenting other ajax calls will fix whatever ive done ahhhh
		load: function(searchTerm) {

			return new Promise(function(resolve, reject) {

				$.ajax({
					url: 'get_tweets.php?search=' + encodeURIComponent(searchTerm),
					type: 'GET',
					success: function(response) {
						console.log(response); //debug

						if (typeof response.errors === 'undefined' || response.errors.length < 1) {

							var output = [];
							//load tweets into output
							$.each(response.statuses, function(i, obj) {
								output.push(obj.text);
							});

							resolve(output);
						}
						else {
							$('.tweets-container p:first').text('Response error');
						}
						
					},

					error: function(errors) {
						reject(output);
					}
				});	
			})

		}

	}

});