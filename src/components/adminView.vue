<template>
  <div class="admin">
    <div class="header">
      <div class="header-content">
        <h1>Admin Panel</h1>
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Search..." 
            v-model="searchQuery"
            @keyup.enter="performSearch"
            class="search-input"
          />
          <i
            class="fas fa-search search-icon" 
            @click="performSearch">
        </i>
        </div>
      </div>
    </div>
    <div class="card" v-for="(jet, jetIndex) in jets" :key="jetIndex">
      <!-- JET Header -->
      <div class="card-left">
        <div class="jet-header">
          <div class="card-header">
            <span>{{ jet["name"] }}</span>
          </div>
          <div class="line"></div>
          <div class="card-image">
            <img :src="jet['img']" :alt="jet['name']" />
          </div>
        </div>
        <div class="jet-airports">
            <h4>Airports : </h4>
            <div class="airports">
                <div v-for="(airport, airportIndex) in jet['current_Locations']" :key="airportIndex" class="airport-pill" >
                    {{ airport }}
                    <i class="fas fa-times cross-btn" @click="removeAirport(jetIndex,airportIndex)"></i>
                </div>
                <div class="add-airport" @click="showAirportPopup(jetIndex)">
                    <i class="fas fa-plus" ></i>
                </div>
            </div>

        </div>
      </div>

      <!-- JET COSTS -->
      <div class="card-right">
        <div class="info-container">
          <div class="info-item">
            <i class="fas fa-tachometer-alt icon"></i>
            <div>
              <h4>Average Speed</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'speed_kmph'"
                  >{{ jet["performance"]["speed_kmph"] }} Km/h</span
                >
                <input
                  v-else
                  v-model.number="jet.performance.speed_kmph"
                  type="number"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('speed_kmph', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-gas-pump icon"></i>
            <div>
              <h4>Fuel Consumption</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'fuel_consumption_gph'"
                  >{{
                    jet["performance"]["fuel_consumption_gph"]
                  }}
                  Gallon/h</span
                >
                <input
                  v-else
                  v-model.number="jet.performance.fuel_consumption_gph"
                  type="number"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('fuel_consumption_gph', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-clock icon"></i>
            <div>
              <h4>Max Flight Time</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'max_flight_time_hours'">{{
                  convertDecimalToTime(
                    jet["performance"]["max_flight_time_hours"]
                  )
                }}</span>
                <input
                  v-else
                  v-model.number="jet.performance.max_flight_time_hours"
                  type="number"
                  step="0.1"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('max_flight_time_hours', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-money-bill-wave icon"></i>
            <div>
              <h4>Jet Flight Rent</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'flight_rent_per_hour'"
                  >${{ jet["rent"]["flight_rent_per_hour"] }} /hour</span
                >
                <input
                  v-else
                  v-model.number="jet.rent.flight_rent_per_hour"
                  type="number"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('flight_rent_per_hour', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-warehouse icon"></i>
            <div>
              <h4>Jet Parked Rent</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'parked_rent_per_hour'"
                  >${{ jet["rent"]["parked_rent_per_hour"] }} /hour</span
                >
                <input
                  v-else
                  v-model.number="jet.rent.parked_rent_per_hour"
                  type="number"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('parked_rent_per_hour', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-hourglass-start icon"></i>
            <div>
              <h4>Min Charge Hours</h4>
              <div class="editable-field">
                <span
                  v-if="editing[jetIndex] !== 'minimum_flight_time_charge_hours'"
                  >{{
                    convertDecimalToTime(
                      jet["minimum_flight_time_charge_hours"]
                    )
                  }}</span
                >
                <input
                  v-else
                  v-model.number="jet.minimum_flight_time_charge_hours"
                  type="number"
                  step="0.1"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('minimum_flight_time_charge_hours', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-users icon"></i>
            <div>
              <h4>Passenger Capacity</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'passenger_capacity'"
                  >{{ jet["passenger_capacity"]["min"] }}-{{
                    jet["passenger_capacity"]["max"]
                  }}</span
                >
                <div v-else class="passenger-inputs">
                  Min:
                  <input
                    v-model.number="jet.passenger_capacity.min"
                    type="number"
                    @blur="saveField(jetIndex)"
                    @keyup.enter="saveField(jetIndex)"
                  />
                  Max:
                  <input
                    v-model.number="jet.passenger_capacity.max"
                    type="number"
                    @blur="saveField(jetIndex)"
                    @keyup.enter="saveField(jetIndex)"
                  />
                </div>
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('passenger_capacity', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-user-tie icon"></i>
            <div>
              <h4>Crew Cost</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'crew_cost_per_hour'"
                  >${{ jet["costs"]["crew_cost_per_hour"] }} /hour</span
                >
                <input
                  v-else
                  v-model.number="jet.costs.crew_cost_per_hour"
                  type="number"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('crew_cost_per_hour', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-tools icon"></i>
            <div>
              <h4>Miscellaneous Costs</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'miscellaneous_costs_per_hour'"
                  >${{
                    jet["costs"]["miscellaneous_costs_per_hour"]
                  }}
                  /hour</span
                >
                <input
                  v-else
                  v-model.number="jet.costs.miscellaneous_costs_per_hour"
                  type="number"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('miscellaneous_costs_per_hour', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-search icon"></i>
            <div>
              <h4>Inspection Cost</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'inspection_cost'"
                  >${{ jet["costs"]["inspection_cost"] }}</span
                >
                <input
                  v-else
                  v-model.number="jet.costs.inspection_cost"
                  type="number"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('inspection_cost', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-plane-arrival icon"></i>
            <div>
              <h4>Landing Fee</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'landing_handling_fees'"
                  >${{ jet["costs"]["landing_handling_fees"] }}</span
                >
                <input
                  v-else
                  v-model.number="jet.costs.landing_handling_fees"
                  type="number"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('landing_handling_fees', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-parking icon"></i>
            <div>
              <h4>Airport Parking</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'airport_parking_per_hour'"
                  >${{ jet["costs"]["airport_parking_per_hour"] }} /hour</span
                >
                <input
                  v-else
                  v-model.number="jet.costs.airport_parking_per_hour"
                  type="number"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('airport_parking_per_hour', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-gas-pump icon"></i>
            <div>
              <h4>Fuel Cost</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'fuel_cost_per_gallon'"
                  >${{ jet["costs"]["fuel_cost_per_gallon"] }} /Gallon</span
                >
                <input
                  v-else
                  v-model.number="jet.costs.fuel_cost_per_gallon"
                  type="number"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('fuel_cost_per_gallon', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-bed icon"></i>
            <div>
              <h4>Crew Accommodation Cost</h4>
              <div class="editable-field">
                <span v-if="editing[jetIndex] !== 'crew_parked_cost_hourly'"
                  >${{ jet["costs"]["crew_parked_cost_hourly"] }} /hour</span
                >
                <input
                  v-else
                  v-model.number="jet.costs.crew_parked_cost_hourly"
                  type="number"
                  @blur="saveField(jetIndex)"
                  @keyup.enter="saveField(jetIndex)"
                />
                <i
                  class="fas fa-pencil-alt edit-icon"
                  @click="toggleEdit('crew_parked_cost_hourly', jetIndex)"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <InfoPopup ref="pillPopup" />
    <AirportPopup ref="airportPopup" @add-airport="addAirport" />
  </div>
</template>

<script>
import InfoPopup from "@/components/infoPopup.vue";
import AirportPopup from "@/components/airportPopup.vue";
export default {
  name: "AdminView",
  components: {
    InfoPopup,AirportPopup
  },

  data() {
    return {
      searchQuery: '',
      allJets:[],
      jets: [],
      editing: {}, // Track which field is being edited for each jet
      originalData: {}, // Store original data in case of cancellation
    };
  },

  mounted() {
    this.getJets();
  },

  methods: {
    performSearch() {
      const searchTerm = this.searchQuery.toLowerCase();
      if(searchTerm==''){
        this.jets=this.allJets;}
      else{
        
        this.jets=this.allJets.filter(jet => 
      jet.name.toLowerCase().includes(searchTerm));
      }
      
    },
    showAirportPopup(jetIndex){
        this.$refs.airportPopup.showPopup(jetIndex);
    },
    async addAirport(payload){

        this.jets[payload.jetIndex]['current_Locations'].push(payload.airportCode);
        await this.saveJet(payload.jetIndex);

    },
    async getJets() {
      const response = await fetch("http://localhost:3001/jets");
      const data = await response.json();
      this.jets = data;
      this.allJets=data;

      // Initialize editing state for each jet
      this.jets.forEach((_, jetIndex) => {
        this.editing[jetIndex] = null;
      });
    },

    convertDecimalToTime(decimalHours) {
      let hours = Math.floor(decimalHours);
      let minutes = Math.round((decimalHours - hours) * 60);

      if (hours > 0) {
        return `${hours} hours ${minutes} mins`;
      } else {
        return `${minutes} mins`;
      }
    },

    toggleEdit(field, jetIndex) {
      if (this.editing[jetIndex] === field) {
        // If clicking the same field's pencil icon, cancel editing
        this.editing[jetIndex] = null;
      } else {
        // Store original value before editing
        if (!this.originalData[jetIndex]) {
          this.originalData[jetIndex] = JSON.parse(
            JSON.stringify(this.jets[jetIndex])
          );
        }
        this.editing[jetIndex] = field;
      }
    },
    async removeAirport(jetIndex,airportIndex){
        this.jets[jetIndex]['current_Locations'].splice(airportIndex, 1);
        await this.saveJet(jetIndex);

    },

    async saveField(jetIndex) {
      this.editing[jetIndex] = null;
      await this.saveJet(jetIndex);
    },

    async saveJet(jetIndex) {
      try {
        const response = await fetch(
          `http://localhost:3001/jets/${this.jets[jetIndex].id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.jets[jetIndex]),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to save changes");
        }

        // Clear original data after successful save
        delete this.originalData[jetIndex];
        this.$refs.pillPopup.showPopup(
          "Changes saved successfully!",true
        );
        
      } catch (error) {
        console.error("Error saving jet:", error);
        // Revert to original data if save fails
        if (this.originalData[jetIndex]) {
          this.jets[jetIndex] = JSON.parse(
            JSON.stringify(this.originalData[jetIndex])
          );
          delete this.originalData[jetIndex];
        }
        this.$refs.pillPopup.showPopup(
          "Failed to save changes. Please try again."
        );
       
      }
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #203544;
  padding: 1.5rem 2rem;
  color: white;
  width: 100%;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content h1 {
  margin: 0;
  
  font-size: 1.8rem;
  font-weight: 600;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 1rem;
  width: 250px;
  transition: width 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #777;
  cursor: pointer;
  transition: color 0.3s ease;
}

.search-icon:hover {
  color: #203544;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-container {
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
  
  .search-input:focus {
    width: 100%;
  }
}
.info-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; 
}
.admin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(255, 255, 255);
  min-height: 100vh;
  padding: 0rem 5rem;
}
.card {
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
  flex-direction: column;
}

.card-right {
  flex: 1 1 300px;
  padding: 24px;
  box-sizing: border-box;
}
.card-left {
  flex: 1 1 100px;
  padding: 24px;
  padding-bottom: 5px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(207, 205, 205);
 
  background-color: #00bcd4;
  position: relative;
}
.jet-header{
    display: flex;
  justify-content: center;
  align-items: center;
}
.jet-airports{
    display: flex;
    justify-content:start;
    align-items: center;
    gap: 20px;
}
.airports{
    display: flex;
    gap: 1rem;
}
.airport-pill{
    padding: 10px;
    background-color: #203544;
    color: white;
    border-radius: 20%;
    font-size: 0.8rem;
    position: relative;
}
.add-airport{
    padding: 10px 15px;
    background-color: #203544;
    color: white;
    border-radius: 20%;
    font-size: 0.7rem;
    position: relative;
    cursor: pointer;
}
.cross-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: white;
  color: #203544;
  padding: 5px 5px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 8px;
  height: 6px;
  width: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-header {
  background: #203544;
  color: white;
  font-size: 20px;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  height: 30px;
  position: relative;
}

.card-image {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
}

.card-image img {
  max-height: 150px;
}

.card-available h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card-available a {
  color: #00bcd4;
  text-decoration: none;
  margin-right: 4px;
}

.card-available a:hover {
  text-decoration: underline;
}
.info-item {
  display: flex;
  flex: 0 1 calc(25% - 15px);
  box-sizing: border-box;
  align-items: center;
  margin-bottom: 24px;
  gap: 5px;
}
.info-item h4 {
  text-align: left;
}
.info-item p {
  text-align: left;
}

.icon {
  font-size: 20px;
  color: white;
  margin-right: 16px;
  background-color: #00bcd4;
  padding: 10px;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-item h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.info-item p {
  margin: 0;
  color: #444;
}

.card-button button {
  width: 30%;
  background: #203544;
  color: white;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.card-button button:hover {
  background: #14535a;
}

.note {
  font-size: 13px;
  color: #666;
  font-style: italic;
  text-align: center;
  margin-top: 12px;
}
.result {
  padding: 2rem 3rem;
}
.line {
  height: 2px;
  width: 200px;
  background-color: #203544;
  margin-right: -120px;
}

/* Edit icon styles */
.edit-icon {
  cursor: pointer;
  margin-left: 8px;
  color: #00bcd4;
  font-size: 14px;
  background: white;
  padding: 5px;
  border-radius: 50%;
}

.editable-field {
  display: flex;
  align-items: center;
  gap: 5px;
}

.editable-field input {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100px;
}

.passenger-inputs {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.passenger-inputs input {
  width: 60px;
}

.card-header input {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  padding: 5px;
  z-index: 10;
}

.card-image input {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  padding: 5px;
  z-index: 10;
  
}
</style>
