const bitcoin = require('bitcoinjs-lib')
const ops = require('bitcoin-ops')

var hexOps = {}

Object.keys(ops).map(function(key, index) {
	hexOps[key] = ("0" + ops[key].toString('16')).substr(-2)
});

function hexLength(s) {
  len = s.length / 2
  return len.toString(16)
}

function lenPrefixedHex(s) {
	return hexLength(s) + s
}

// returns scriptPubKey Buffer for p2pkh
function p2pkh(addr) {
 	var scriptPubKeyHex = hexOps.OP_DUP + hexOps.OP_HASH160 + lenPrefixedHex(addr) + hexOps.OP_EQUALVERIFY + hexOps.OP_CHECKSIG
  	var scriptPubKey =  new Buffer(scriptPubKeyHex, "hex")
	return scriptPubKey
}

function sign(keyPair, tx, index, script){
	var hashType = bitcoin.Transaction.SIGHASH_ALL
	var signatureHash = tx.hashForSignature(index, script, hashType)
	var sig = keyPair.sign(signatureHash).toScriptSignature(hashType)
	return sig
}

module.exports = {
	hexLength: hexLength,
	lenPrefixedHex: lenPrefixedHex,
	ops: hexOps,
	p2pkh: p2pkh,
	sign: sign
}

