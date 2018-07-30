<template>
  <div class="LinkWithHash">
    <img src="../assets/logo.png" class="logo">
    <P2PFileSharing :ipfsHash="$route.params.hash"/>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import P2PFileSharing from '@/components/P2PFileSharing'
import Footer from '@/components/Footer'

export default {
  name: 'LinkWithHash',
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
