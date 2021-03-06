const bitcoin = require('bitcoinjs-lib')
const {lenPrefixedHex, ops, p2pkh} = require('./util')

var addr = 'mh8tGnF6RCsnWUMTw1WL9UWjjgyMRRTM8t'
var wif = 'cT8gHG8a3gHPBDDLve4A6SKUjTQwNnJ3A3oGjzrqZmXGQJ7dfmQ6'
var txid = '0079072c1813552af1c444a98d662eda019264930106128a767aa6cb61388245'
var txOutput = 0
var amount = 530200000

var keyPair = bitcoin.ECPair.fromWIF(wif, bitcoin.networks.testnet);
var pubKey = keyPair.getPublicKeyBuffer().toString('hex')

// decode the b58check encoded address to hex
HASH160 = bitcoin.address.fromBase58Check(addr).hash.toString('hex')

scriptPubKey = p2pkh(HASH160)

let tx = new bitcoin.Transaction() 
txHash = Buffer.from(txid, 'hex').reverse() // txhash is reversed because bitcoin is crazy
tx.addInput(txHash, txOutput, null, null) 
tx.addOutput(scriptPubKey, amount)

hashType = bitcoin.Transaction.SIGHASH_ALL
signatureHash = tx.hashForSignature(0, scriptPubKey, hashType)
sig = keyPair.sign(signatureHash).toScriptSignature(hashType)

var scriptSigHex = lenPrefixedHex(sig.toString('hex')) + lenPrefixedHex(pubKey)
tx.ins[0].script = new Buffer(scriptSigHex, "hex")


console.log(tx.toHex())

