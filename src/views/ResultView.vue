<template>
  <div class="result">
    <div class="estimate-header">
      <h2>Your Estimates Are Below</h2>
      <p><strong>Please Note:</strong> These are not formal quotes.</p>
      <div class="estimate-info">
        <p>
          <strong>{{ formatDate(formData["departureDate"]) }}</strong>
          <strong v-if="formData['tripType'] == 'round-trip'">
            --- {{ formatDate(formData["arrivalDate"]) }}</strong
          >
        </p>
        <p>
          {{ formData["departureAirport"]["city"] }} ({{
            formData["departureAirport"]["code"]
          }}) to {{ formData["arrivalAirport"]["city"] }} ({{
            formData["arrivalAirport"]["code"]
          }})
        </p>
        <p>{{ formData["noOfPassengers"] }} passengers</p>
      </div>
    </div>
    
    <!-- Jet cards loop -->
    <div class="card" v-for="(jet, index) in jets" :key="index">
      <!-- Left side -->
      <div class="card-left">
        <div class="card-header">{{ jet["name"] }}</div>
        <div class="card-image">
          <img :src="jet['img']" :alt="jet['name']" />
        </div>
        <div class="card-available">
          <h3>COMMONLY AVAILABLE</h3>
          <p>
            <a href="#">King Air 90</a>, <a href="#"> Pilatus PC-12</a>,
            <a href="#"> King Air 350</a>
          </p>
        </div>
      </div>

      <!-- Right side -->
      <div class="card-right">
        <div class="info-item">
          <i class="fas fa-dollar-sign icon"></i>
          <div>
            <h4>AVERAGE PRICE</h4>
            <p>
              ${{
                Math.floor(
                  jet["EstimatedCost"] - jet["EstimatedCost"] * 0.1
                )
              }}
              to ${{
                Math.floor(
                  jet["EstimatedCost"] + jet["EstimatedCost"] * 0.1
                )
              }}
            </p>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-plane icon"></i>
          <div>
            <h4>AVERAGE FLIGHT TIME</h4>
            <p>{{ convertDecimalToTime(jet["oneSideFlightTime"]) }}</p>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-chair icon"></i>
          <div>
            <h4>SEATS</h4>
            <p>
              {{ jet["passenger_capacity"]["min"] }}-{{
                jet["passenger_capacity"]["max"]
              }}
            </p>
          </div>
        </div>
        <div class="card-button">
          <button>Book Your Trip</button>
          <p class="note">
            Prices are estimates only. Lead time, availability, and demand will
            affect formal quotes.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  name: "ExecutiveTurboprops",

  props: ["jets", "formData"],

  methods: {
    formatDate(dateString) {
      let date = new Date(dateString);
      let options = { day: "2-digit", month: "long", year: "numeric" };
      return date.toLocaleDateString("en-GB", options);
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
  },
};
</script>

<style scoped>
.card {
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 1rem 0px;
  margin-bottom: 2rem;
}

.card-left,
.card-right {
  flex: 1 1 300px;
  padding: 24px;
  box-sizing: border-box;
}
.card-left {
  border-right: 1px solid rgb(207, 205, 205);
}

.card-header {
  background: #00bcd4;
  color: white;
  font-size: 20px;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 24px;
}

.card-image {
  text-align: center;
  margin-bottom: 24px;
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
  align-items: center;
  margin-bottom: 24px;
  gap: 15px;
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
  width: 100%;
  background: #00bcd4;
  color: white;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.card-button button:hover {
  background: #0097a7;
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
.estimate-header {
  text-align: center;
  margin-bottom: 2rem;
}

.estimate-header h2 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.estimate-header p {
  font-size: 14px;
  color: #555;
  margin: 0.25rem 0;
}

.estimate-info {
  margin-top: 1rem;
}

.estimate-info p {
  margin: 0.25rem 0;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}
</style>
