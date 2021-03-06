'use strict';

//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

//console.log(truckers);
//console.log(deliveries);
//console.log(actors);


//STEP 1

function shippingPrice(){
  var final = []; //contain final infos
  var shipPrice; //Price of shipment
  var repartition = [] ; // contains the infos of the comission
  for(var i in deliveries)
  {
    shipPrice = totPrice(deliveries[i].distance, deliveries[i].volume, deliveries[i].truckerId); //computing price (distance * volume)
    //decreasing pricing for high volume
    if(deliveries[i].volume > 5 && deliveries[i].volume <= 10 ){
      shipPrice = 0.9 * shipPrice;
    }
    else if(deliveries[i].volume > 10 && deliveries[i].volume <= 25){
      shipPrice = 0.7 * shipPrice;

    } else if(deliveries[i].volume > 25  ){
      shipPrice = 0.5 * shipPrice;
    }


    deliveries[i].price = shipPrice;
    repartition = retrieveComission(shipPrice, deliveries[i]); //30% of the price goes to the commission

    final.push({ //display final result and details of deliveries
      id: deliveries[i].id,
      distance: deliveries[i].distance,
      volume: deliveries[i].volume,
      truckerId: deliveries[i].truckerId,
      price: shipPrice,
      commission: repartition
    });


  }
    console.log(final);
}
function findDeliveryById(id){
  for(var i in actors){
    if(id == actors[i].deliveryId){

      return actors[i];

    }
  }

}


function retrieveComission(shipPrice, deli){ //applies the 30% retrieval commission from the total price

  var commission = 0.3*shipPrice;
  var insurance = 0 ;
  var treasury = 1 ;
  var convargo = 0 ;
  var dist = deli.distance;
  var deductibleValue=0;


  insurance = commission / 2;
  commission *= 0.5;

  if(dist => 500){
    while(dist > 500){
      dist = dist - 500
      treasury += 1 ;
    }
  }
  commission -= treasury;
  convargo = commission  ; //if false, equals 0

  if(deli.options.deductibleReduction == true)
  {
    deductibleValue = deli.volume;
    convargo += deductibleValue;
  }

  var repartition = [];
  var options = [];
  var ded = deli.options.deductibleReduction;

//Step 5: repartion between all actors
  var actor = {};

  actor = findDeliveryById(deli.id); //find the delivery
  var arr = Object.values(actor);

  for(var j = 0; j < arr[1].length; j++){

  if(arr[1][j].who =="shipper"){
    arr[1][j].amount = shipPrice - deductibleValue;
  }

else  if(arr[1][j].who == "trucker"){
    arr[1][j].amount = shipPrice - shipPrice*0.3;
  }
else  if(arr[1][j].who == "insurance"){
    arr[1][j].amount = insurance;
  }
else  if(arr[1][j].who == "treasury"){
    arr[1][j].amount = treasury ;
  }
  else if(arr[1][j].who == "convargo"){
    arr[1][j].amount = commission ;
  }

}
console.log(actor); //displays the actual actor



options.push({
  deductibleOption: ded,
  deductibleValue: deductibleValue
});

  repartition.push({
    total: shipPrice*0.3,
    insurance: insurance,
    treasury: treasury,
    convargo: convargo,
    options: options
  });

  return repartition;
}

function totPrice(distance, volume, truckerId){ //price by distance, volume, and ID of the trucker

  var priceKM;
  var priceVOL;
  var commission;

  for(var i in truckers){
    if(truckerId == truckers[i].id){
      priceKM = truckers[i].pricePerKm;
      priceVOL = truckers[i].pricePerVolume;
      break;
    }
  }


  var dist = distance * priceKM;
  var vol = volume * priceVOL;

  var finalPrice = dist + vol;

  return finalPrice;
}

shippingPrice();
