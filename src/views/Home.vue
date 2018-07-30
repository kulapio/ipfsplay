<template>
  <div class="home">
    <img src="../assets/logo.png" class="logo">
    <P2PFileSharing/>
  </div>
</template>

<script>
// @ is an alias to /src
import P2PFileSharing from '@/components/P2PFileSharing'

export default {
  name: 'home',
  components: {
    P2PFileSharing
  }
}
</script>
<style scoped>
.logo {
  max-width: 80%;
}
</style>
