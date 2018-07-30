<template>
  <div class="WithEthereum">
    <img src="../assets/logo.png" class="logo">
    <P2PFileSharingWithSmartContract/>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import P2PFileSharingWithSmartContract from '@/components/P2PFileSharingWithSmartContract'
import Footer from '@/components/Footer'

export default {
  name: 'WithEthereum',
  components: {
    P2PFileSharingWithSmartContract,
    Footer
  }
}
</script>
<style scoped>
.logo {
  max-width: 80%;
}
</style>
