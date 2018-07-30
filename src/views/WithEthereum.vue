<template>
  <div class="WithEthereum">
    <img src="../assets/logo.png" class="logo">
    <P2PFileSharingWithSmartContract/>
  </div>
</template>

<script>
// @ is an alias to /src
import P2PFileSharingWithSmartContract from '@/components/P2PFileSharingWithSmartContract'

export default {
  name: 'WithEthereum',
  components: {
    P2PFileSharingWithSmartContract
  }
}
</script>
<style scoped>
.logo {
  max-width: 80%;
}
</style>
