<template>
  <div className="P2PFileSharing">

    <section class="hero is-medium is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            P2P File Sharing with IPFS
          </h1>
          <h2 class="subtitle">
            <Form v-if="state === State.Ready || state === State.Finished" v-on:submit.prevent="onSubmit">
              <b-field class="fileUpload">
                <b-upload v-model="files"
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
                <a class="card-footer-item" @click="copyHash">Copy Hash</a>
                <a class="card-footer-item" @click="copyPublicLink">Copy Public Link</a>
                <social-sharing :url="shareUrl"
                  class="card-footer-item share"
                  title="I just share a file via IPFS!"
                  description="I just share a file via IPFS!"
                  quote="I just share a file via IPFS!"
                  hashtags="ipfs,infura"
                  twitter-user="kulap"
                  inline-template>
                  <div>
                    <network network="facebook">
                      <i class="fa fa-facebook"></i>Share
                    </network>
                  </div>
                </social-sharing>
              </footer>
            </div>

            <div v-if="state === State.Uploading" class="uploading">
              <vue-loading type="bars" color="#5ac1dd" :size="{ width: '50px', height: '50px' }"></vue-loading>
              <span>Uploading...</span>
            </div>

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
import { Toast } from 'buefy'

const State = {
  Ready: 'Ready',
  Uploading: 'Uploading',
  Finished: 'Finished'
}

export default {
  name: 'P2PFileSharing',
  data () {
    return {
      state: State.Ready,
      State: State,

      ipfs: ipfs,
      files: [],
      dropFiles: [],
      buffer: '',
      ipfsGateways: ipfsGateways
    }
  },
  props: {
    ipfsHash: {
      type: String,
      default: ''
    }
  },
  computed: {
    isIpfsLinkReady () {
      return this.ipfsHash !== ''
    },
    shareUrl () {
      return `${this.$store.state.sharePrefix}/${this.ipfsHash}`
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

    async uploadToIpfs () {
      this.state = State.Uploading
      this.ipfsHash = ''

      // save document to IPFS,return its hash#, and set hash# to state
      // https:// github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
      await ipfs.add(this.buffer, (err, ipfsHash) => {
        console.log(err, ipfsHash)
        // setState by setting ipfsHash to ipfsHash[0].hash
        this.ipfsHash = ipfsHash[0].hash
        this.state = State.Finished
      }) // await ipfs.add
    },
    copyText (text) {
      this.$copyText(text).then(function (e) {
        Toast.open({
          message: 'Copied!',
          position: 'is-bottom',
          type: 'is-success'
        })
      }, function (e) {
        Toast.open({
          duration: 5000,
          message: 'Can\'t copy',
          position: 'is-bottom',
          type: 'is-danger'
        })
      })
    },
    copyHash () {
      this.copyText(this.ipfsHash)
    },
    copyPublicLink () {
      const link = `${this.ipfsGateways[0].prefix}/${this.ipfsHash}`
      this.copyText(link)
    }
  },
  watch: {
    files (newValue, oldValue) {
      console.log(`newValue ${newValue} ${newValue[0]}`)
      console.log(`oldValue ${oldValue} ${oldValue.length}`)
      this.captureFile()
    },
    buffer (newValue, oldValue) {
      this.uploadToIpfs()
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

.uploading {
  margin: 80px;
}
</style>

<style>
.card-footer-item.share {
  padding: 0px;
}

.card-footer-item.share span {
  width: 100%;
  height: 100%;
  padding: 12px;
  color: #7957d5;
  cursor: pointer;
}
</style>
