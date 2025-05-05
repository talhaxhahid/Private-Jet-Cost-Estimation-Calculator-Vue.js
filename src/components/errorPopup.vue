<template>
    <div v-if="visible" class="pill-popup">
      <i class="fas fa-exclamation-triangle"></i>
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        visible: false,
        message: 'This is a pill popup!',
      };
    },
    methods: {
      showPopup(message = 'This is a pill popup!') {
        this.message = message;
        this.visible = true;
        setTimeout(() => {
          this.visible = false;
        }, 5000); // Fade away after 3 seconds
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
    background-color: red;
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
  
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  </style>
  