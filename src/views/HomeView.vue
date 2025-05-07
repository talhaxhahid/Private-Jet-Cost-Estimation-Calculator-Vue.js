<template>
  <div class="home">
    <div class="calculator">
      <div class="header">
        <h1>Charter Flight Cost Calculator</h1>
      </div>
      <div class="calculator-body">
        <div class="trip-options">
          <label
            v-for="option in tripOptions"
            :key="option.value"
            :class="[
              'trip-option',
              { selected: selectedTrip === option.value },
            ]"
          >
            <input
              type="radio"
              name="trip"
              :value="option.value"
              v-model="selectedTrip"
            />
            {{ option.label }}
          </label>
        </div>
        <div v-if="selectedTrip == 'round-trip' || selectedTrip == 'one-way'">
          <div class="flight-form">
            <div class="form-row">
              <div class="combo-box">
                <div class="input-container">
                  <input
                    type="text"
                    required
                    v-model="departureAirpot"
                    @input="departureSuggestions(departureAirpot)"
                    @blur="selectDefaultAirports"
                  />
                  <label>Departure Airport</label>
                </div>
                <ul
                  v-if="
                    depatureAirportSuggestions &&
                    depatureAirportSuggestions.length
                  "
                >
                  <li
                    v-for="(option, index) in depatureAirportSuggestions"
                    :key="index"
                    @click="selectDeparture(option)"
                  >
                    {{ option.icao }}/{{ option.code }}, {{ option.name }},
                    {{ option.city }}, {{ option.country }}
                  </li>
                </ul>
              </div>

              <div class="form-row">
                <div class="input-container">
                  <input
                    @focus="setDepartureDateInputType"
                    v-model="departureDate"
                    :type="departureDateInputType"
                    required
                    :min="validDate"
                    @blur="validateDates"
                  />
                  <label>Departure Date</label>
                </div>
                <div
                  v-if="selectedTrip == 'round-trip'"
                  class="input-container"
                >
                  <input
                    @focus="setReturnDateInputType"
                    v-model="returnDate"
                    :type="returnDateInputType"
                    required
                    :min="departureDate"
                    @blur="validateDates"
                  />
                  <label>Return Date</label>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="combo-box">
                <div class="input-container">
                  <input
                    type="text"
                    required
                    v-model="arrivalAirpot"
                    @input="arrivalSuggestions(arrivalAirpot)"
                    @blur="selectDefaultAirports"
                  />
                  <label>Arrival Airport</label>
                </div>
                <ul
                  v-if="
                    arrivalAirportSuggestions &&
                    arrivalAirportSuggestions.length
                  "
                >
                  <li
                    v-for="(option, index) in arrivalAirportSuggestions"
                    :key="index"
                    @click="selectArrival(option)"
                  >
                    {{ option.icao }}/{{ option.code }}, {{ option.name }},
                    {{ option.city }}, {{ option.country }}
                  </li>
                </ul>
              </div>
              <div class="input-container">
                <input
                  type="number"
                  required
                  min="1"
                  max="25"
                  v-model="noOfPassengers"
                  @blur="validatePassengers"
                />
                <label>Passengers</label>
              </div>
            </div>
            <button @click="submitForEstimation" class="book-button">
              View Estimates And Book
            </button>
          </div>
        </div>
        <div v-else class="coming-soon">
          <h3>Coming Soon...!</h3>
        </div>
      </div>
    </div>
    <InfoPopup ref="pillPopup" />
  </div>
</template>

<script>
import { caclutateEstimation } from "@/utils/calculateEstimate";
import InfoPopup from "@/components/infoPopup.vue";

export default {
  name: "HomeView",
  components: {
    InfoPopup,
  },
  data() {
    return {
      // TRIP OPTIONS
      selectedTrip: "one-way",
      tripOptions: [
        { value: "one-way", label: "One Way" },
        { value: "round-trip", label: "Round Trip" },
        { value: "multi-leg", label: "Multi-Leg" },
      ],

      // DEPARTURE AND ARRIVAL DATE VARIABLES
      validDate: new Date().toISOString().split("T")[0],
      departureDate: "",
      departureDateInputType: "text",
      returnDate: "",
      returnDateInputType: "text",

      // DEPARTURE AIRPORT VARIABLES

      departureAirpot: "",
      depatureAirportSuggestions: [],
      selectedDeaprtureAirport: {},

      // ARRIVAL AIRPORT VARIABLES
      arrivalAirpot: "",
      arrivalAirportSuggestions: [],
      selectedArrivalAirport: {},

      //No of Passengers
      noOfPassengers: "",
    };
  },

  methods: {
    setDepartureDateInputType() {
      this.departureDate = new Date().toISOString().split("T")[0];
      this.departureDateInputType = "date";
    },
    setReturnDateInputType() {
      this.returnDate = new Date().toISOString().split("T")[0];
      this.returnDateInputType = "date";
    },
    async departureSuggestions(searchTerm) {
      if (searchTerm.length > 1) {
        const response = await fetch(
          "http://localhost:3000/airpots?_limit=5&city_like=" + searchTerm
        );
        const data = await response.json();
        this.depatureAirportSuggestions = data;
      } else {
        this.depatureAirportSuggestions = [];
      }
    },
    async arrivalSuggestions(searchTerm) {
      if (searchTerm.length > 1) {
        const response = await fetch(
          "http://localhost:3000/airpots?_limit=5&city_like=" + searchTerm
        );
        const data = await response.json();
        this.arrivalAirportSuggestions = data;
      } else {
        this.arrivalAirportSuggestions = [];
      }
    },

    selectDeparture(selectedItem) {
      if (selectedItem.code == this.selectedArrivalAirport.code) {
        this.$refs.pillPopup.showPopup(
          "Departure & Arrival Airports Cant be Same"
        );
      } else {
        this.selectedDeaprtureAirport = selectedItem;
        this.departureAirpot =
          selectedItem.icao +
          "/" +
          selectedItem.code +
          ", " +
          selectedItem.name +
          ", " +
          selectedItem.city +
          ", " +
          selectedItem.country;
        this.depatureAirportSuggestions = [];
      }
    },
    selectArrival(selectedItem) {
      if (selectedItem.code == this.selectedDeaprtureAirport.code) {
        this.$refs.pillPopup.showPopup(
          "Departure & Arrival Airports Cant be Same"
        );
      } else {
        this.selectedArrivalAirport = selectedItem;
        this.arrivalAirpot =
          selectedItem.icao +
          "/" +
          selectedItem.code +
          ", " +
          selectedItem.name +
          ", " +
          selectedItem.city +
          ", " +
          selectedItem.country;
        this.arrivalAirportSuggestions = [];
      }
    },
    selectDefaultAirports() {
      const d = this.selectedDeaprtureAirport || {};
      const a = this.selectedArrivalAirport || {};

      this.departureAirpot =
        `${d.icao ? d.icao + "/" : ""}${d.code ? d.code + ", " : ""}` +
        `${d.name ? d.name + ", " : ""}` +
        `${d.city ? d.city + ", " : ""}` +
        `${d.country || ""}`.trim();

      this.arrivalAirpot =
        `${a.icao ? a.icao + "/" : ""}${a.code ? a.code + ", " : ""}` +
        `${a.name ? a.name + ", " : ""}` +
        `${a.city ? a.city + ", " : ""}` +
        `${a.country || ""}`.trim();

      setTimeout(() => {
        this.depatureAirportSuggestions = [];
        this.arrivalAirportSuggestions = [];
      }, 500);
    },
    validatePassengers() {
      if (this.noOfPassengers < 0 || this.noOfPassengers > 25) {
        this.$refs.pillPopup.showPopup("Passengers Cant be More than 25");

        this.noOfPassengers = Math.min(Math.max(this.noOfPassengers, 0), 25);
      }
    },
    validateDates() {
      if (
        this.returnDate < this.departureDate &&
        this.selectedTrip == "round-trip"
      ) {
        this.$refs.pillPopup.showPopup("Return Date cant be before departure");
        this.returnDate = this.departureDate;
      }
      if (this.departureDate < this.validDate) {
        this.$refs.pillPopup.showPopup("Kindly Choose a Valid Date");
        this.departureDate = this.validDate;
      }
    },
    submitForEstimation() {
      if (
        Object.keys(this.selectedArrivalAirport).length === 0 ||
        Object.keys(this.selectedDeaprtureAirport).length === 0
      ) {
        this.$refs.pillPopup.showPopup("Kindly Choose a Valid Airports");
      } else if (
        this.returnDate < this.departureDate &&
        this.selectedTrip == "round-trip"
      ) {
        this.$refs.pillPopup.showPopup("Return Date cant be before departure");
        this.returnDate = this.departureDate;
      } else if (this.departureDate < this.validDate) {
        this.$refs.pillPopup.showPopup("Kindly Choose a Valid Date");
        this.departureDate = this.validDate;
      } else if (
        this.noOfPassengers == "" ||
        this.noOfPassengers < 0 ||
        this.noOfPassengers > 25
      ) {
        if (this.noOfPassengers > 25)
          this.$refs.pillPopup.showPopup("Passengers Cant be More than 25");
        else {
          this.$refs.pillPopup.showPopup("Kindly Enter Number of Passengers");
        }

        this.noOfPassengers = Math.min(Math.max(this.noOfPassengers, 1), 25);
      } else {
        caclutateEstimation({
          tripType: this.selectedTrip,
          departureAirport: this.selectedDeaprtureAirport,
          arrivalAirport: this.selectedArrivalAirport,
          departureDate: this.departureDate,
          arrivalDate: this.returnDate,
          noOfPassengers: this.noOfPassengers,
        });
      }
    },
  },
};
</script>

<style >
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(255, 255, 255);
  min-height: 100vh;
  padding: 0rem 5rem;
}

.calculator {
  width: 100%;
  box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.25);
}

.header {
  background-color: #203544;
  padding: 0.5rem;
  color: white;
  text-align: center;
}

.calculator-body {
  min-height: 20vh;
  background-color: white;
  padding: 2rem 1.5rem;
}

.trip-options {
  display: flex;
  gap: 10px;
}

.trip-option {
  padding: 10px 20px;
  border: 1px solid #000000;
  border-radius: 6px;
  cursor: pointer;
  background-color: white;
  color: #333;
  font-weight: 500;
  transition: 0.2s;
}

.trip-option.selected {
  background-color: #00b7e5;
  color: white;
  border-color: #00b7e5;
}

input[type="radio"] {
  display: none;
}
.coming-soon {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.flight-form {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex: 1;
}

.book-button {
  width: 100%;
  padding: 1rem;
  background-color: #00b7e5;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.input-container {
  position: relative;
  margin-top: 20px;
  flex: 1;
}

.input-container input {
  width: 100%;
  border: none;
  border-bottom: 1.5px solid #ccc;
  background-image: linear-gradient(to right, #007bff 100%, transparent 100%);
  background-size: 0% 2px;
  background-repeat: no-repeat;
  background-position: bottom left;
  transition: background-size 0.3s ease-in-out;
  outline: none;
  padding: 8px 0;
  font-size: 16px;
}

.input-container label {
  position: absolute;
  top: 8px;
  left: 0;
  color: #696868;
  font-size: 14px;
  pointer-events: none;
  transition: 0.2s ease all;
}

.input-container input:focus + label,
.input-container input:valid + label {
  top: -14px;
  font-size: 12px;
  color: #007bff;
}

.input-container input:focus {
  border-bottom: none;
  background-size: 100% 2px;
}

.combo-box {
  position: relative;
  flex: 1;
}
ul {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
}
li {
  padding: 8px;
  cursor: pointer;
  text-align: left;
}
li:hover {
  background: #007bff;
  color: white;
}
</style>
