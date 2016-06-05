'use strict';

function TestLocation(delay) {
  TestLocation.prototype.testLocationIndex = 0;

//  latitude,longitude,n
//56.126801,10.111962,1
//56.126801,10.110962,2
//56.127801,10.110962,3
//56.127801,10.111962,4

  this.testPositions0 = [
    {coords: {latitude: 56.126801, longitude: 10.111962 }}, // syd for
    {coords: {latitude: 56.126801, longitude: 10.110962 }},  // øst for
    {coords: {latitude: 56.127801, longitude: 10.110962 }}, // nord for
    {coords: {latitude: 56.127801, longitude: 10.111962 }} // vest for
  ];

  // 140 km/h constant, bearing 235 deg
  this.testPositionsasd = [
    {coords: {latitude: 56.05861617257451, longitude: 9.959416743377185}, timestamp:   1439575350728},
    {coords: {latitude: 56.058253319986214, longitude: 9.958356935540175}, timestamp:   1439575352804},
    {coords: {latitude: 56.0578758828864, longitude: 9.957254966730211}, timestamp:   1439575354836},
    {coords: {latitude: 56.057504816032996, longitude: 9.956209911042784}, timestamp:   1439575356901},
    {coords: {latitude: 56.05715432675188, longitude: 9.955157227823468}, timestamp:   1439575358954},
    {coords: {latitude: 56.05681163264071, longitude: 9.954065820211502}, timestamp:   1439575360995},
    {coords: {latitude: 56.056476398423364, longitude: 9.952973993504376}, timestamp:   1439575363055},
    {coords: {latitude: 56.05598806874459, longitude: 9.951329212645023}, timestamp:   1439575365122},
    {coords: {latitude: 56.055658282764306, longitude: 9.950218610474794}, timestamp:   1439575367154},
    {coords: {latitude: 56.05533025698369, longitude: 9.949087137365666}, timestamp:   1439575369195},
    {coords: {latitude: 56.05503760283445, longitude: 9.9480197858158}, timestamp:   1439575371251},
    {coords: {latitude: 56.0547166178525, longitude: 9.946951260799493}, timestamp:   1439575373293},
    {coords: {latitude: 56.05444164951896, longitude: 9.945833366373503}, timestamp:   1439575375333},
    {coords: {latitude: 56.0541647952572, longitude: 9.94472159073683}, timestamp:   1439575377401},
    {coords: {latitude: 56.05388978501414, longitude: 9.943623142326198}, timestamp:   1439575379468},
    {coords: {latitude: 56.053614565223505, longitude: 9.94251019322308}, timestamp:   1439575381510},
    {coords: {latitude: 56.0533455061317, longitude: 9.941539987930973}, timestamp:   1439575383548},
    {coords: {latitude: 56.05309995827829, longitude: 9.940478336075264}, timestamp:   1439575385605},
    {coords: {latitude: 56.05265693278616, longitude: 9.938649572441298}, timestamp:   1439575388611},
    {coords: {latitude: 56.052382551185836, longitude: 9.93751172908576}, timestamp:   1439575390655},
    {coords: {latitude: 56.052136416599204, longitude: 9.936297945687487}, timestamp:   1439575392712},
    {coords: {latitude: 56.051764176279356, longitude: 9.934541434058858}, timestamp:   1439575395497},
    {coords: {latitude: 56.05147177358721, longitude: 9.933572905147386}, timestamp:   1439575398045},
    {coords: {latitude: 56.05118507058923, longitude: 9.93185319007368}, timestamp:   1439575400099},
    {coords: {latitude: 56.050847782805604, longitude: 9.930076058963248}, timestamp:   1439575403417}];

  // på motorvej
  this.testPositions22 = [
    {coords: {latitude: 55.89879926299294, longitude: 9.81174395420571}, timestamp:   1439355476194 },
    {coords: {latitude: 55.897908350504835, longitude: 9.810876427227456}, timestamp: 1439355479106 },
    {coords: {latitude: 55.89731935416897, longitude: 9.810280725369052}, timestamp:  1439355481192 },
    {coords: {latitude: 55.89672193402042, longitude: 9.809663901114659}, timestamp:  1439355483265 },
    {coords: {latitude: 55.8961349074318, longitude: 9.809010531762437}, timestamp:   1439355485348 },
    {coords: {latitude: 55.89557575067123, longitude: 9.80835841969569}, timestamp:   1439355487432 },
    {coords: {latitude: 55.89503222616007, longitude: 9.807688202718094}, timestamp:  1439355489664 },
    {coords: {latitude: 55.8939384297057, longitude: 9.8062959686013}, timestamp:     1439355494016 },
    {coords: {latitude: 55.893676034226914, longitude: 9.805943593391968}, timestamp: 1439355494091 },
    {coords: {latitude: 55.89316369039555, longitude: 9.805247811609698}, timestamp:  1439355496242 },
    {coords: {latitude: 55.89267033157488, longitude: 9.804550101989697}, timestamp:  1439355498438 },
    {coords: {latitude: 55.89120043912519, longitude: 9.802303835758755}, timestamp:  1439355504235 },
    {coords: {latitude: 55.89120043912519, longitude: 9.802303835758755}, timestamp:  1439355504255 },
    {coords: {latitude: 55.89048181665678, longitude: 9.801099943006225}, timestamp:  1439355507185 },
    {coords: {latitude: 55.889768600515914, longitude: 9.799860343346186}, timestamp: 1439355510294 },
    {coords: {latitude: 55.88932725140442, longitude: 9.799027685085123}, timestamp:  1439355512415 },
    {coords: {latitude: 55.88892202829559, longitude: 9.798206677669471}, timestamp:  1439355514520 },
    {coords: {latitude: 55.88852736638476, longitude: 9.797416850933615}, timestamp:  1439355516601 },
    {coords: {latitude: 55.88815692817409, longitude: 9.796651247897927}, timestamp:  1439355518684 },
    {coords: {latitude: 55.88744283193339, longitude: 9.795216266074958}, timestamp:  1439355522781 },
    {coords: {latitude: 55.88689293717582, longitude: 9.794180598119082}, timestamp:  1439355525605 },
    {coords: {latitude: 55.88635087949772, longitude: 9.793078545490086}, timestamp:  1439355528297 },
    {coords: {latitude: 55.8859728975742, longitude: 9.79235409759897}, timestamp:    1439355530413 },
    {coords: {latitude: 55.88538993620862, longitude: 9.791253972807704}, timestamp:  1439355533817 },
    {coords: {latitude: 55.88480890268077, longitude: 9.79016466067153}, timestamp:   1439355536896 },
    {coords: {latitude: 55.88441185192753, longitude: 9.789432082334336}, timestamp:  1439355538987 }
  ];

// ved kolt
  TestLocation.prototype.testPositions = [
    {coords: {latitude: 56.11928130566347, longitude: 10.06965842702568}, timestamp: 1439354456190 },
    {coords: {latitude: 56.11928130566347, longitude: 10.06965842702568}, timestamp: 1439354456237 },
    {coords: {latitude: 56.11928130566347, longitude: 10.06965842702568}, timestamp: 1439354459415 },
    {coords: {latitude: 56.11289012716721, longitude: 10.070644095549426}, timestamp: 1439354461447 },
    {coords: {latitude: 56.11254361929009, longitude: 10.07084802725359}, timestamp: 1439354463510 },
    {coords: {latitude: 56.11230205284069, longitude: 10.070782229313693}, timestamp: 1439354465814 },
    {coords: {latitude: 56.11182956495891, longitude: 10.070790443578801}, timestamp: 1439354468827 },
    {coords: {latitude: 56.11151360911886, longitude: 10.07068097592338}, timestamp: 1439354470925 },
    {coords: {latitude: 56.11087105242173, longitude: 10.070027522752126}, timestamp: 1439354475375 },
    {coords: {latitude: 56.110613602265815, longitude: 10.069753685975511}, timestamp: 1439354477575 },
    {coords: {latitude: 56.110377358324925, longitude: 10.069452691832621}, timestamp: 1439354479776 },
    {coords: {latitude: 56.110377358324925, longitude: 10.069452691832621}, timestamp: 1439354479808 },
    {coords: {latitude: 56.1099885218368, longitude: 10.069028148436983}, timestamp: 1439354482514 },
    {coords: {latitude: 56.10961053991328, longitude: 10.06865959615453}, timestamp: 1439354485823 },
    {coords: {latitude: 56.10935011418174, longitude: 10.068432278940518}, timestamp: 1439354487926 },
    {coords: {latitude: 56.10914538619677, longitude: 10.068272771323162}, timestamp: 1439354490016 },
    {coords: {latitude: 56.1088502593861, longitude: 10.068131200978595}, timestamp: 1439354492126 },
    {coords: {latitude: 56.10872985334704, longitude: 10.068068252885777}, timestamp: 1439354494208 },
    {coords: {latitude: 56.108675496704976, longitude: 10.067927939826685}, timestamp: 1439354496288 },
    {coords: {latitude: 56.108700600504974, longitude: 10.06775032729848}, timestamp: 1439354498378 },
    {coords: {latitude: 56.10871987888227, longitude: 10.067538181329208}, timestamp: 1439354500455 },
    {coords: {latitude: 56.108745024591784, longitude: 10.067258477220374}, timestamp: 1439354502553 }
  ];

  // requires 5 sec interval to fit speed
  this.testPositions1 = [
    {coords: {latitude: 56.126801, longitude: 10.110962 }},
    {coords: {latitude: 56.127136, longitude: 10.111002 }},
    {coords: {latitude: 56.127229, longitude: 10.110667 }},
    {coords: {latitude: 56.127129, longitude: 10.110039 }},
    {coords: {latitude: 56.127063, longitude: 10.109573 }},
    {coords: {latitude: 56.126756, longitude: 10.109728 }},
    {coords: {latitude: 56.126471, longitude: 10.109860 }},
    {coords: {latitude: 56.126193, longitude: 10.110010 }},
    {coords: {latitude: 56.126172, longitude: 10.110165 }},
    {coords: {latitude: 56.126170, longitude: 10.110308 }},
    {coords: {latitude: 56.126166, longitude: 10.110477 }},
    {coords: {latitude: 56.126185, longitude: 10.110662 }},
    {coords: {latitude: 56.126296, longitude: 10.110804 }},
    {coords: {latitude: 56.126576, longitude: 10.110890 }},
    {coords: {latitude: 56.126576, longitude: 10.110890 }},
    {coords: {latitude: 56.126576, longitude: 10.110890 }},
    {coords: {latitude: 56.126576, longitude: 10.110890 }}
  ];
}

TestLocation.prototype.get = function (callback) {
  TestLocation.prototype.callback = callback;
  var callCallback = function(){
    TestLocation.prototype.callback(TestLocation.prototype.testPositions[TestLocation.prototype.testLocationIndex++]);
    if(TestLocation.prototype.testLocationIndex < TestLocation.prototype.testPositions.length-1){
      setTimeout(callCallback, 1000); // check again in a second
    }
  };
  callCallback();
};

module.exports = TestLocation;
