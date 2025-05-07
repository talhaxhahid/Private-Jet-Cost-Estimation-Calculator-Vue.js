<template>
  <div v-if="visible" class="modal">
    <div class="airport-popup">
      <h4>ADD AIRPORT</h4>
      <div class="combo-box">
        <div class="input-container">
          <input
            type="text"
            required
            v-model="Airpot"
            @input="Suggestions(Airpot)"
            @blur="selectDefaultAirports"
          />
          <label>Search Airport</label>
        </div>
        <ul v-if="AirportSuggestions && AirportSuggestions.length">
          <li
            v-for="(option, index) in AirportSuggestions"
            :key="index"
            @click="selectAirport(option)"
          >
            {{ option.icao }}/{{ option.code }}, {{ option.name }},
            {{ option.city }}, {{ option.country }}
          </li>
        </ul>
      </div>

      <button class="book-button" @click="addAirport">Add</button>
      <i class="fas fa-times cross-btn" @click="closePopup"></i>
    </div>
  </div>
  <InfoPopup ref="pillPopup" />
</template>

<script>
import InfoPopup from "@/components/infoPopup.vue";
export default {
  components: {
    InfoPopup,
  },
  data() {
    return {
      visible: false,
      Airpot: "",
      AirportSuggestions: [],
      selectedAirport: {},
      jetIndex: null,
    };
  },
  methods: {
    showPopup(jetIndex) {
      this.jetIndex = jetIndex;
      document.body.style.overflow = "hidden";
      this.visible = true;
    },
    closePopup() {
      document.body.style.overflow = "";
      this.visible = false;
      this.Airpot = "";
      this.selectedAirport = {};
      this.AirportSuggestions = [];
    },
    addAirport() {
      if (Object.keys(this.selectedAirport).length === 0) {
        this.$refs.pillPopup.showPopup("Please choose a valid Airport");
      } else {
        const data = {
          airportCode: this.selectedAirport.code,
          jetIndex: this.jetIndex,
        };
        this.$emit("add-airport", data);
        this.visible = false;
        document.body.style.overflow = "";
        this.Airpot = "";
        this.selectedAirport = {};
        this.AirportSuggestions = [];
      }
    },

    async Suggestions(searchTerm) {
      if (searchTerm.length > 1) {
        const response = await fetch(
          "http://localhost:3000/airpots?_limit=5&city_like=" + searchTerm
        );
        const data = await response.json();
        this.AirportSuggestions = data;
      } else {
        this.AirportSuggestions = [];
      }
    },
    selectAirport(selectedItem) {
      this.selectedAirport = selectedItem;
      this.Airpot =
        selectedItem.icao +
        "/" +
        selectedItem.code +
        ", " +
        selectedItem.name +
        ", " +
        selectedItem.city +
        ", " +
        selectedItem.country;
      this.AirportSuggestions = [];
    },
    selectDefaultAirports() {
    console.log("Helloooo");
    const d = this.selectedAirport || {};
    this.Airpot =
      `${d.icao ? d.icao + "/" : ""}${d.code ? d.code + ", " : ""}` +
      `${d.name ? d.name + ", " : ""}` +
      `${d.city ? d.city + ", " : ""}` +
      `${d.country || ""}`.trim();

    setTimeout(() => {
      this.AirportSuggestions = [];
    }, 500);
  },
  },
  
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100%;
  background-color: #00000058;
  display: flex;
  justify-content: center;
  align-items: center;
}
.airport-popup {
  position: relative;
  background-color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 16px;
  text-align: center;
  animation: fadeOut 3s forwards;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 300px;
  flex-direction: column;
}
.cross-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #203544;
  color: white;
  padding: 5px 5px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  height: 16px;
  width: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.combo-box {
  width: 100%;
}
.book-button {
  background-color: #203544;
}
</style>
