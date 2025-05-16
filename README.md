PRIVATE JET COST CALCULATOR 

 Frontend :  Vue.js 
 Backend Api :  Json Server 

Frontend :  
How to Run ? 
 npm install   
 npm run serve   
Backend Api : 
 npm i -g json-server@0.17.4 
 npx json-server --watch src/data/airports.json    
 npx json-server --watch src/data/jets.json --port 3001 
Note : We need json-server of the exact same version 0.17.4 , because we are using some 
features which are no longer available in latest version of json server 


FEATURES  IMPLEMENTED 
Calculator Screen : 
 Two Trip Types ( One Way & Return Flight ) 
 Real Time Suggestions for the keyword Entered for Airports 
 Only Allow user to choose from the available airports in Suggestions 
 Validations on the Input Fields of Calculator 
Estimation Calculation Module Workflow : 
 We will first get all the jets in our database 
 All category jets are available/parked at multiple airports so from every category jet 
we will first choose the jet nearest to the departure location , so minimum empty leg 
/ ferry charges will be added to customer ( Due to that a Long Range jet may be 
cheaper than the Mid-Size Jet Because Long Range Jet is having less distance from 
the departure airport)  
 Then we will calculate the total distance covered , including the empty leg distance 
(covered by the jet to reach the departure airport) . the distance is calculated using 
the Haversine formula. 
 Then we will calculate the total flight time based on the speed of the Jet if the flight 
time is very less than the customer is charged based on the minimum flight time 
cost defined for the jet 
 Total fuel consumed by the jet 
 No of time the jet needed to land for refueling if we are travelling more than the jet 
one time range 
 Then sum up all the cost factors , e.g fuel costs , jet rent , airport rent , crew cost , 
landing charges , inspection charges etc 
Result  Screen : 
 Show all the available jets along with their attributes 
 Show the Estimated Cost with 10% variation 