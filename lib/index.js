'use strict';

let OVUpgradeComponent = require('./OVUpgradeComponent');

function upgradeComponent(index, output) {
    let ovUpgradeComponent = new OVUpgradeComponent(index, output);
}


module.exports = {
    upgradeComponent: upgradeComponent
};