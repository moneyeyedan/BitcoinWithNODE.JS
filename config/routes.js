

module.exports.routes = {  
  'post /generate_new_address' : 'BitcoinController.generateNewAddress',
  'post /get_balance' : 'BitcoinController.getBalance',
  'post /dump_private_key' : 'BitcoinController.dumpPrivateKey',
  'post /import_privatekey' : 'BitcoinController.importPrivateKey',
  'post /get_unconfirmed_balance' : 'BitcoinController.getUnconfirmedBalance',
  'post /transfer' : 'BitcoinController.transfer',
  
  'post /api/new_main_address' : 'BitcoinapiController.createMainAccount',
  'post /api/new_test_address' : 'BitcoinapiController.createTestAccount',
  'post /api/test_address_balance' : 'BitcoinapiController.testBalance',
  'post /api/main_address_balance' : 'BitcoinapiController.mainBalance',
  'post /api/decode' : 'BitcoinapiController.decodeTransaction',
  'post /api/transaction' : 'BitcoinapiController.transaction',
  'post /api/swipe_account' : 'BitcoinapiController.swipe'

};
