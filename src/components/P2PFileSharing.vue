<template>
  <div className="P2PFileSharing">

    <section class="hero is-medium is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            P2P File Sharing with IPFS
          </h1>
          <h2 class="subtitle">
            <Form v-on:submit.prevent="onSubmit">
              <input type="file" @change="captureFile" class="button" />
              <Button bsStyle="primary" type="submit" class="button is-success">
                Send it
              </Button>
            </Form>

            <div v-if="isIpfsLinkReady" class="card">
              <header class="card-header">
                <p class="card-header-title">
                  IPFS Hash #
                </p>
                <a href="#" class="card-header-icon" aria-label="more options">
                  <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </a>
              </header>
              <div class="card-content">
                <div class="content">
                  <strong>{{ ipfsHash }}</strong>
                </div>
              </div>
              <footer class="card-footer">
                <a href="#" class="card-footer-item">Copy Hash</a>
                <a href="#" class="card-footer-item">Copy Public Link</a>
                <a href="#" class="card-footer-item">Share</a>
              </footer>
            </div>

            <span v-if="ipfsHash === 'Uploading...'">Uploading...</span>

            <b-table v-if="isIpfsLinkReady" :data="ipfsGateways" class="linkTable">
              <template slot-scope="props">
                <b-table-column field="id" label="Node">
                  {{ props.row.id }}
                </b-table-column>

                <b-table-column field="prefix" label="Link">
                  <a :href="`${props.row.prefix}/${ipfsHash}`" target="_blank">
                    {{ props.row.prefix }}/{{ipfsHash}}
                  </a>
                </b-table-column>
              </template>
            </b-table>
          </h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ipfs from '@/js/ipfs'
import ipfsGateways from '@/js/ipfsGateways'

export default {
  name: 'P2PFileSharing',
  data () {
    return {
      ipfs: ipfs,

      ipfsHash: '',
      buffer: '',
      ipfsGateways: ipfsGateways
    }
  },
  computed: {
    isIpfsLinkReady () {
      return this.ipfsHash !== '' && this.ipfsHash !== 'Uploading...'
    }
  },
  methods: {

    async captureFile (event) {
      console.log(`event ${event}`)
      event.stopPropagation()
      event.preventDefault()
      const file = event.target.files[0]
      let reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => this.convertToBuffer(reader)
    },

    async convertToBuffer (reader) {
      // file is converted to a buffer for upload to IPFS
      const buffer = await Buffer.from(reader.result)
      this.buffer = buffer
    },

    async onSubmit (event) {
      this.ipfsHash = 'Uploading...'

      // save document to IPFS,return its hash#, and set hash# to state
      // https:// github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
      await ipfs.add(this.buffer, (err, ipfsHash) => {
        console.log(err, ipfsHash)
        // setState by setting ipfsHash to ipfsHash[0].hash
        this.ipfsHash = ipfsHash[0].hash
      }) // await ipfs.add
    }
  }
}
</script>

<style scoped>
.hero.is-primary .subtitle a:not(.button), .hero.is-primary .subtitle strong {
  color: #7957d5;
}

.card {
  margin-top: 25px;
}

.linkTable {
  margin-top: 25px;
}
</style>
