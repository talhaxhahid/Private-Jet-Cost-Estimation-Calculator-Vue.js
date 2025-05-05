import router from '@/router';
var jets;
export async function caclutateEstimation(formData) {

    jets = await getJets();
    await chooseNearestJet(formData);
    await totalDistanceCovered(formData);
    await totalFlightTime(formData);
    await totalFuelConsumption();
    await calculateRefueling();


    await calculateAllCosts(formData);

     router.push({ name: 'result',
        query: { jets:JSON.stringify(jets), formData: JSON.stringify(formData) }
      });

}


async function getJets() {
    const response = await fetch(
        "http://localhost:3001/jets"
    );
    const data = await response.json();
    return data;

}

async function chooseNearestJet(formData) {
    for (var jet in jets) {
        var minimumFerryDistance=null;
        for (var airport in jets[jet]["current_Locations"]) {
            const response = await fetch("http://localhost:3000/airpots?code=" + jets[jet]["current_Locations"][airport]);
            const data = await response.json();
            const calculatedDistnace = calculateDistance(formData['departureAirport']['lat'], formData['departureAirport']['lon'], data[0]['lat'], data[0]['lon']);
            
            if (minimumFerryDistance == null || calculatedDistnace < minimumFerryDistance) {
                minimumFerryDistance = calculatedDistnace;
                
            }
        }
        jets[jet]['minimumFerryDistance'] = 2 * minimumFerryDistance;
        
        

    }

}
async function totalDistanceCovered(formData) {
    const calculatedDistnace = calculateDistance(formData['departureAirport']['lat'], formData['departureAirport']['lon'], formData['arrivalAirport']['lat'], formData['arrivalAirport']['lon']);
    for (var jet in jets) {
        jets[jet]['totalDistance'] = (2 * calculatedDistnace) + jets[jet]['minimumFerryDistance'];

    }

}

async function totalFlightTime(formData) {

    for (var jet in jets) {
        jets[jet]['oneSideFlightTime'] = calculateDistance(formData['departureAirport']['lat'], formData['departureAirport']['lon'], formData['arrivalAirport']['lat'], formData['arrivalAirport']['lon']) / jets[jet]['performance']['speed_kmph'];
        jets[jet]['totalFlightTime'] = jets[jet]['totalDistance'] / jets[jet]['performance']['speed_kmph'];

    }

}

async function totalFuelConsumption() {

    for (var jet in jets) {
        jets[jet]['totalFuelConsumption'] = jets[jet]['totalFlightTime'] * jets[jet]['performance']['fuel_consumption_gph'];
        

    }

}

async function calculateRefueling() {
    for (var jet in jets) {
        jets[jet]['noOfRefueling'] = Math.floor(jets[jet]['totalFlightTime'] / jets[jet]['performance']['max_flight_time_hours']);

    }

}

async function calculateAllCosts(formData) {

    if (formData['tripType'] == "one-way") {

        for (var jet in jets) {

            var OneWayFlightTime=(((jets[jet]['totalDistance']-jets[jet]['minimumFerryDistance'])/2)/ jets[jet]['performance']['speed_kmph'])
            
            if(OneWayFlightTime<jets[jet]['minimum_flight_time_charge_hours']){OneWayFlightTime=jets[jet]['minimum_flight_time_charge_hours']}
            
            
            //Jet Rent During the flight time (Only for the Flight Time When Customer is on it)
            jets[jet]['EstimatedCost']=OneWayFlightTime*jets[jet]['rent']['flight_rent_per_hour'];
            
            //Jet Petrol Cost (for Over Return Distance including Ferry Distance)
            jets[jet]['EstimatedCost']=(jets[jet]['totalFuelConsumption']*jets[jet]['costs']['fuel_cost_per_gallon'])+jets[jet]['EstimatedCost'];
            
            //Crew and Other Costs per Hour (Only for the Flight Time When Customer is on it)
            jets[jet]['EstimatedCost']+=(OneWayFlightTime*jets[jet]['costs']['crew_cost_per_hour'])+(OneWayFlightTime*jets[jet]['costs']['miscellaneous_costs_per_hour']);
            
            //Plane Inspection Cost Before Flight
            jets[jet]['EstimatedCost']+=jets[jet]['costs']['inspection_cost'];
            
            //Landing Fees (All LandinG fees Including Landing for Refueling)
            jets[jet]['EstimatedCost']+= (jets[jet]['noOfRefueling']+2)*jets[jet]['costs']['landing_handling_fees']; 
                      
            
        }
    } else if (formData['tripType'] == "round-trip") {

        for (var jet in jets) {

            var TwoWayFlightTime=((jets[jet]['totalDistance']-jets[jet]['minimumFerryDistance'])/ jets[jet]['performance']['speed_kmph'])
            if(TwoWayFlightTime<jets[jet]['minimum_flight_time_charge_hours']){TwoWayFlightTime=jets[jet]['minimum_flight_time_charge_hours']}
        
            //Jet Rent During the flight time (Only for the Flight Time When Customer is on it)
            jets[jet]['EstimatedCost']=TwoWayFlightTime*jets[jet]['rent']['flight_rent_per_hour'];
            
            //Jet Petrol Cost (for Over Return Distance including Ferry Distance)
            jets[jet]['EstimatedCost']=(jets[jet]['totalFuelConsumption']*jets[jet]['costs']['fuel_cost_per_gallon'])+jets[jet]['EstimatedCost'];
            
            //Crew and Other Costs per Hour (Only for the Flight Time When Customer is on it)
            jets[jet]['EstimatedCost']+=(TwoWayFlightTime*jets[jet]['costs']['crew_cost_per_hour'])+(TwoWayFlightTime*jets[jet]['costs']['miscellaneous_costs_per_hour']);
            
            //Plane Inspection Cost Before Flight
            jets[jet]['EstimatedCost']+=jets[jet]['costs']['inspection_cost'];
            
            //Landing Fees (All LandinG fees Including Landing for Refueling)
            jets[jet]['EstimatedCost']+= (jets[jet]['noOfRefueling']+2)*jets[jet]['costs']['landing_handling_fees']; 
            

            /* COSTS WHEN THE JET IS PARKED (WAITING TO TAKE BACK THE CUSTOMER) */

            const TotalParkedTime=((new Date(formData['arrivalDate'])-new Date(formData['departureDate'])) / (1000 * 60 * 60))-jets[jet]['totalFlightTime'];
            jets[jet]['EstimatedCost']+= TotalParkedTime*jets[jet]['costs']['crew_parked_cost_hourly'];
            jets[jet]['EstimatedCost']+= TotalParkedTime*jets[jet]['costs']['airport_parking_per_hour'];

            

        }
    }

}


function calculateDistance(lat1, lon1, lat2, lon2) {
    /**
     * Calculate the great-circle distance between two points 
     * on the Earth (specified in decimal degrees) in kilometers.
     * 
     * @param {number} lat1 - Latitude of first point in decimal degrees
     * @param {number} lon1 - Longitude of first point in decimal degrees
     * @param {number} lat2 - Latitude of second point in decimal degrees
     * @param {number} lon2 - Longitude of second point in decimal degrees
     * @returns {number} Distance between the two points in kilometers
     */

    // Convert degrees to radians
    const toRad = value => value * Math.PI / 180;

    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}








