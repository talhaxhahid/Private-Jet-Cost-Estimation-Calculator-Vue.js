<template>
    <div v-if="visible" class="pill-popup" :class="success?'success' : 'error'">
      <i class="fas " :class="success?'fa-check-circle':'fa-exclamation-triangle'"></i>
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        visible: false,
        message: 'This is a pill popup!',
        success:false
      };
    },
    methods: {
      showPopup(message = 'This is a pill popup!' , success=false) {
        this.message = message;
        this.success=success;
        this.visible = true;
        setTimeout(() => {
          this.visible = false;
        }, 5000); 
      }
    }
  };
  </script>
  
  <style scoped>
  .pill-popup {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 16px;
    text-align: center;
    animation: fadeOut 3s forwards;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }
  .success{
    background-color: rgb(19, 142, 66);
  }
  .error{
    background-color: red;
  }
  
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  </style>
  