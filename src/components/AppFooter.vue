<script>
export default {};
</script>

<template>
  <footer>
    <div class="myContainer">
      <div class="img">
        <img src="../assets/img/logo-b.png" alt="logo" />
      </div>
      <div class="h-100 d-flex align-items-center">
        <p class="m-0">&copy; 2023 - BoolBnb</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  width: 100%;
  height: 50px;
  background-color: rgb(230, 230, 230);

  .myContainer {
    width: 80%;
    height: 100%;
    margin-inline: auto;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .img {
      height: 30px;

      img {
        height: 100%;
      }
    }

    .info {
      p {
        margin: 0;
      }
    }
  }
}
</style>
