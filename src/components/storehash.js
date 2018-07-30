import web3 from './web3'
const address = '0x5c5a2a6bd414bf80ad9901d367f650e6db7ed37c'
const abi = [
  {
    'constant': true,
    'inputs': [],
    'name': 'getHash',
    'outputs': [
      {
        'name': 'x',
        'type': 'string'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'x',
        'type': 'string'
      }
    ],
    'name': 'sendHash',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }
]
export default new web3.eth.Contract(abi, address)
