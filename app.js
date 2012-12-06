
(function ($) {

	this.cardManager = function () {

		var angleStrength = 10; // in degrees, this should be 0 - 45deg

		var scaleRanges = [1.0, 1.3];
		var marginRange = [0, 60];

		var numElements = 5; // make this odd, bitches

		var defaultMargin = 0;

		var focused, focusedSet; 

		var hashes = {
			angles: [],
			scales: [],
			margins: []
		}

		// function getMean(arr) {

		// 	var sum = 0, i = -1;

		// 	while(++i < arr.length) {
		// 		sum += arr[i];
		// 	}

		// 	return sum / arr.length
		// }

		// function getStdev(arr) {

		// 	var mean = getMean(arr), sqDeviations = [], dSum = 0, i = -1;

		// 	while(++i < arr.length) {
		// 		sqDeviations.push( Math.pow( (arr[i] - mean), 2 ) );
		// 	}

		// 	i = -1;
		// 	while(++i < sqDeviations.length) {
		// 		dSum += sqDeviations[i];
		// 	}

		// 	return Math.sqrt( dSum / (sqDeviations.length - 1) );
		// }

		function setDefaults() {

			var brute = parseInt(numElements/2);
			
			hashes.margins = jstat.seq(marginRange[0], marginRange[1], brute + 1);

			hashes.scales = jstat.seq(scaleRanges[0], scaleRanges[1], brute + 1);

			hashes.angles =  jstat.seq(0, angleStrength, brute + 1 );
			hashes.angles[ hashes.angles.length -1 ] = 0;

			// === rando notes === \\

			// calculating angles is diff because we're _/_\_ not _/-\_
			// var angleTmp = jstat.seq(angleRange[0], angleRange[1], numElements / 2 );

			// var y = jstat.dnorm(x, 0.0, angleStrength);

			// var x = jstat.seq( 0, angleStrength, numElements ); 
			// var y = new NormalDistribution( getMean(x), getStdev(x) );

			// console.log( x, getMean(x), getStdev(x), y.getQuantile(0.9) );

			// for angle, should probably calculate "tween position" & then calculate value based on quantile

			var i = -1;
			while(++i < brute) {
				hashes.margins.push( hashes.margins[ brute - i - 1 ] );				
				hashes.scales.push( hashes.scales[ brute - i - 1 ] );

				hashes.angles.push( - hashes.angles[ brute - i - 1 ] );
			}

			defaultMargin = $('.focused').css('marginTop');
		}

		function drawRotation() {

			gatherCards();

			$(focusedSet).each(function(i) {

				$(this).transition(
					{
					    perspective: '100px',
					    rotateX: hashes.angles[i] + 'deg',
					    scale: hashes.scales[i],
					    marginTop: hashes.margins[i] + 'px',
					    marginBottom: hashes.margins[i] + 'px'
					}
				).removeClass('resetMe');

				// $(this).css( { 'margin-top': hashes.margins[i], 'margin-bottom':  } );
			});

			$('.resetMe').transition(
				{
					marginTop: defaultMargin,
					marginBottom: defaultMargin
				}
			).removeClass('resetMe');
		}

		function gatherCards() {
			focused = $('.focused');

			focusedSet = focused
				.add(focused.nextAll().slice(0, ( (numElements-1) / 2) ))
				.add(focused.prevAll().slice(0, ( (numElements-1) / 2) ));
		}

		function setNext() {
			$('.focused').removeClass('focused').next().addClass('focused');

			focusedSet.addClass('resetMe');

			drawRotation();

			// move card holder
			$('.card-container').transition( {
				marginTop: '-=' + $('.focused').height() + 'px'
			});

		}

		function setPrev() {

			$('.focused').removeClass('focused').prev().addClass('focused');

			focusedSet.addClass('resetMe');

			drawRotation();

			// move card holder
			$('.card-container').transition( {
				marginTop: '+=' + $('.focused').height() + 'px'
			});

		}

		return {

			init: function() {
				// draw cards
				var i = -1;
				while(++i < 20) {
					$('#card-list').append("<div class='card'></div>");    
				}

				$('.card:eq(' + parseInt(numElements/2) + ')').addClass('focused');

				$.fx.speeds._default = 100;

				setDefaults();

				drawRotation();

				$('body').live('keydown', function(e) { 
					var keyCode = e.keyCode || e.which; 

					if (keyCode == 9 && e.shiftKey) { 
						e.preventDefault(); 
						setPrev();
					} else if (keyCode == 9) { 
						e.preventDefault(); 
						setNext();
					} 
				});


			}

		};

	};

}(jQuery));

cardManager().init();