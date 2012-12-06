
(function ($) {

	this.cardManager = function () {

		var angleStrength = 5; // in degrees, this should be 0 - 45deg

		var scaleRanges = [1.0, 1.3];
		var marginRange = [0, 40];

		var numElements = 9; // make this odd, bitches

		var hashes = {
			angles: [],
			scales: [],
			margins: []
		}

		function getMean(arr) {

			var sum = 0, i = -1;

			while(++i < arr.length) {
				sum += arr[i];
			}

			return sum / arr.length
		}

		function getStdev(arr) {

			var mean = getMean(arr), sqDeviations = [], dSum = 0, i = -1;

			while(++i < arr.length) {
				sqDeviations.push( Math.pow( (arr[i] - mean), 2 ) );
			}

			i = -1;
			while(++i < sqDeviations.length) {
				dSum += sqDeviations[i];
			}

			return Math.sqrt( dSum / (sqDeviations.length - 1) );
		}

		function calcRotationHashes() {

			var brute = parseInt(numElements/2);
			
			hashes.margins = jstat.seq(marginRange[0], marginRange[1], brute + 1);

			hashes.scales = jstat.seq(scaleRanges[0], scaleRanges[1], brute + 1);

			hashes.angles =  jstat.seq(0, angleStrength, brute + 1 );
			hashes.angles[ hashes.angles.length -1 ] = 0;

			console.log(hashes.angles);

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

			console.log(hashes.angles);
		}

		function drawRotation() {

			focused = $('.focused');

			focusedSet = focused
				.add(focused.nextAll().slice(0, ( (numElements-1) / 2) ))
				.add(focused.prevAll().slice(0, ( (numElements-1) / 2) ));

			$(focusedSet).css('border', '1px solid red');

			// based on ranges + rules draw rotations

			// angles _/_\_

			// scales _/-\_

			// _.map($(focusedSet), $.transition())

			$(focusedSet).each(function(i) {

				console.log(i, hashes.angles[i]);

				$(this).transition(
					{
					    perspective: '100px',
					    rotateX: hashes.angles[i] + 'deg',
					    scale: hashes.scales[i],
					    marginTop: '+=' + hashes.margins[i] + 'px',
					    marginBottom: '+=' + hashes.margins[i] + 'px'
					}
				);

				// $(this).css( { 'margin-top': hashes.margins[i], 'margin-bottom':  } );
			});

			// margins _/-\_

			// $(focusedSet).each(function(i) {
			// 	$(this).css( { 'margin-top': hashes.margins[i], 'margin-bottom': hashes.margins[i] } );
			// });
		}

		function setNext() {

			focused = $('.focused');
			focused.removeClass('focused').next().addClass('focused');

			drawRotation();

		}

		function setPrev() {

			// focused = $('.focused');

		}

		return {

			init: function() {
				// draw cards
				var i = -1;
				while(++i < 15) {
					$('#card-list').append("<div class='card'></div>");    
				}

				$('.card:eq(' + parseInt(numElements/2) + ')').addClass('focused');

				calcRotationHashes();
				drawRotation();

				// create keyboard listener
				// setNext

				$('body').live('keydown', function(e) { 
					var keyCode = e.keyCode || e.which; 

					if (keyCode == 9) { 
					e.preventDefault(); 
					
					setNext();

					} 
				});


			}

		};

	};

}(jQuery));

cardManager().init();