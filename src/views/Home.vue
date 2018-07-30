<template>
  <div class="home">
    <img src="../assets/logo.png" class="logo">
    <P2PFileSharing/>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import P2PFileSharing from '@/components/P2PFileSharing'
import Footer from '@/components/Footer'

export default {
  name: 'home',
  components: {
    P2PFileSharing,
    Footer
  }
}
</script>
<style scoped>
.logo {
  max-width: 80%;
}
</style>
