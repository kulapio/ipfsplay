<template>
  <div className="HelloWorld">
    <header className="App-header">
      <h1> Ethereum and IPFS with Create React App</h1>
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
    <Button @click="onClick"> Get Transaction Receipt </Button>
    <Table bordered responsive>
      <thead>
        <tr>
          <th>Tx Receipt Category</th>
          <th>Values</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>IPFS Hash # stored on Eth Contract</td>
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
        <tr>
          <td>Ethereum Contract Address</td>
          <td>{{ ethAddress }}</td>
        </tr>
        <tr>
          <td>Tx Hash # </td>
          <td>{{ transactionHash }}</td>
        </tr>
        <tr>
          <td>Block Number # </td>
          <td>{{ blockNumber }}</td>
        </tr>
        <tr>
          <td>Gas Used</td>
          <td>{{ gasUsed }}</td>
        </tr>

      </tbody>
    </Table>
  </div>
</template>

<script>
import web3 from './web3'
import ipfs from './ipfs'
import storehash from './storehash'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      web3: web3,
      storehash: storehash,
      ipfs: ipfs,

      ipfsHash: '',
      buffer: '',
      ethAddress: '',
      blockNumber: '',
      transactionHash: '',
      gasUsed: '',
      txReceipt: '',
      ipfsGateways: [
        'https://ipfs.infura.io/ipfs',
        'https://ipfs.io/ipfs',
        'https://gateway.ipfs.io/ipfs',
        'https://www.eternum.io/ipfs'
      ]
    }
  },
  methods: {
    // fileChange (event) {
    //   console.log(`event ${event}`)
    //   // console.log(`file ${event.target.files[0]}`)

    //   const file = event.target.files[0]
    //   let reader = new window.FileReader()
    //   reader.readAsArrayBuffer(file)
    //   reader.onloadend = () => this.convertToBuffer(reader)
    // },

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

    async onClick () {
      try {
        this.blockNumber = 'waiting..'
        this.gasUsed = 'waiting...'
        // get Transaction Receipt in console on click
        // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        await web3.eth.getTransactionReceipt(this.transactionHash, (err, txReceipt) => {
          console.log(err, txReceipt)
          this.txReceipt = txReceipt
        })
        // await for getTransactionReceipt
        this.blockNumber = this.txReceipt.blockNumber
        this.gasUsed = this.txReceipt.gasUsed
      } catch (error) {
        console.log(error)
      }
    },

    async onSubmit (event) {
      // event.preventDefault()
      // bring in user's metamask account address
      const accounts = await web3.eth.getAccounts()

      console.log('Sending from Metamask account: ' + accounts[0])
      // obtain contract address from storehash.js
      const ethAddress = storehash.options.address
      this.ethAddress = ethAddress

      this.ipfsHash = 'Uploading...'

      // save document to IPFS,return its hash#, and set hash# to state
      // https:// github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
      await ipfs.add(this.buffer, (err, ipfsHash) => {
        console.log(err, ipfsHash)
        // setState by setting ipfsHash to ipfsHash[0].hash
        this.ipfsHash = ipfsHash[0].hash
        //  call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract
        // return the transaction hash from the ethereum contract
        // see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send

        storehash.methods.sendHash(this.ipfsHash).send({
          from: accounts[0]
        }, (error, transactionHash) => {
          if (error) {
            console.error(error)
            return
          }
          console.log(transactionHash)
          this.transactionHash = transactionHash
        }) // storehash
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
