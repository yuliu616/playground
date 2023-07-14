<template>
  <div class="ui icon message">
    <i class="inbox icon"></i>
    <div class="content">
      <div class="header">
        Sorry ...
      </div>
      <p>I have nothing to show you.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NothingToShow',
  created: function(){
    console.log('NothingToShow got route:', 
      this.$route.params.pathMatch);
  },
};
</script>

<style scoped>
div.ui.message {
  max-width: 40em;
  margin: 0 auto;
}
</style>