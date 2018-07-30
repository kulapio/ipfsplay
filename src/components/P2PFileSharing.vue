<template>
  <div className="P2PFileSharing">
    <header className="App-header">
      <h1> P2P File Sharing with IPFS</h1>
    </header>

    <hr />

    <h3> Choose file to send to IPFS </h3>
    <Form v-on:submit.prevent="onSubmit">
      <input type="file" @change="captureFile" />
      <Button bsStyle="primary" type="submit">
        Send it
      </Button>
    </Form>
    <hr/>
    <Table bordered responsive>
      <thead>
        <tr>
          <th>Category</th>
          <th>Values</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>IPFS Hash #</td>
          <td>
            {{ ipfsHash }}
          </td>
        </tr>
        <tr v-if="ipfsHash != '' && ipfsHash != 'Uploading...'" v-for="(ipfsGateway, i) in ipfsGateways" :key="ipfsGateway">
          <td>Link to File #{{ i+1 }}</td>
          <td>
            <a :href="`${ipfsGateway}/${ipfsHash}`" target="_blank">
              {{ ipfsGateway }}/{{ipfsHash}}
            </a>
          </td>
        </tr>

      </tbody>
    </Table>

    <div class="content has-text-centered">
      <p>
        <strong>Powered</strong> by <a href="https://www.kulap.io">KULAP.io</a>, The Best Rate Decentralized Exchange,
        <a href="https://infura.io/">INFURA.io</a>. Distributed Storage.
      </p>
    </div>
  </div>
</template>

<script>
import ipfs from './ipfs'

export default {
  name: 'P2PFileSharing',
  data () {
    return {
      ipfs: ipfs,

      ipfsHash: '',
      buffer: '',
      ipfsGateways: [
        'https://ipfs.infura.io/ipfs',
        'https://ipfs.io/ipfs',
        'https://gateway.ipfs.io/ipfs',
        'https://www.eternum.io/ipfs'
      ]
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

/*some css I added*/
input[type=”file”] {
 display: inline-block;
}
.table {
 max-width: 90%;
 margin: 10px;
}
.table th {
 text-align: center;
}
/*end of my css*/
</style>
