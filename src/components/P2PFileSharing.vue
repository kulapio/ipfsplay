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
              <b-field class="fileUpload">
                <b-upload v-model="files"
                  multiple
                  drag-drop>
                  <section class="section">
                    <div class="content has-text-centered">
                      <p>
                        <b-icon
                          icon="upload"
                          size="is-large">
                        </b-icon>
                      </p>
                      <p class="dropFileLabel">Drop your file here</p>
                    </div>
                  </section>
                </b-upload>
              </b-field>

              <b-upload v-model="files">
                <a class="button is-primary">
                  <span>Select a file</span>
                </a>
              </b-upload>

              <b-field class="file">
                <span class="file-name"
                  v-if="files && files.length">
                  {{ files[0].name }}
                </span>
              </b-field>

              <!-- <Button bsStyle="primary" type="submit" class="button is-success">
                Send it
              </Button> -->
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
      files: [],
      dropFiles: [],
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

    async captureFile () {
      // console.log(`event ${event}`)
      // event.stopPropagation()
      // event.preventDefault()
      const file = this.files[0]
      let reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => this.convertToBuffer(reader)
    },

    async convertToBuffer (reader) {
      // file is converted to a buffer for upload to IPFS
      const buffer = await Buffer.from(reader.result)
      this.buffer = buffer
    },

    async onSubmit () {
      this.ipfsHash = 'Uploading...'

      // save document to IPFS,return its hash#, and set hash# to state
      // https:// github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
      await ipfs.add(this.buffer, (err, ipfsHash) => {
        console.log(err, ipfsHash)
        // setState by setting ipfsHash to ipfsHash[0].hash
        this.ipfsHash = ipfsHash[0].hash
      }) // await ipfs.add
    }
  },
  watch: {
    files (newValue, oldValue) {
      console.log(`newValue ${newValue} ${newValue[0]}`)
      console.log(`oldValue ${oldValue} ${oldValue.length}`)
      this.captureFile()
    },
    buffer (newValue, oldValue) {
      this.onSubmit()
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

.fileUpload {
  margin: 60px;
}

.dropFileLabel {
  font-size: 32px;
}
</style>
