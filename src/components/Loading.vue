<script>
export default {};
</script>

<template>
  <div class="body">
    <div class="loader">
      <div class="loader-circle"></div>
    </div>
  </div>
</template>

<style scoped>
.body {
  background-color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  margin: 0;
  font-family: Arial, sans-serif;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loader-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: pulse 1.5s ease-in-out infinite;
}

.loader-circle:before {
  content: "";
  display: block;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 11px solid #485ba1;
  border-color: #485ba1 transparent #485ba1 transparent;
  animation: loader 1.2s linear infinite;
}

@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
}
</style>
