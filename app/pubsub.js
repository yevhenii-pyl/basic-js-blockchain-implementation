const PubNub = require("pubnub");

const credentials = {
  publishKey: "pub-c-6d6e87d2-eec0-4e8a-92a3-d6fa3d7cf4f6",
  subscribeKey: "sub-c-7fd80aaa-8598-11ec-8ecc-dee9ee9643e0",
  uuid: "sec-c-NDMyZGNmZGYtNjM4ZC00ZjRjLWE2NzUtOWIwYTVmNTY4NmM0",
};

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    this.pubnub = new PubNub(credentials);
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

    this.pubnub.addListener(this.listener());
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  listener() {
    return {
      message: (messageObject) => {
        const { channel, message } = messageObject;

        console.log(
          `Message received. Channel: ${channel}. Message: ${message}`
        );
        const parsedMessage = JSON.parse(message);

        switch (channel) {
          case CHANNELS.BLOCKCHAIN:
            this.blockchain.replaceChain(parsedMessage);
            break;
          default:
            return;
        }
      },
    };
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }

  subscribeToChannels() {
    this.pubnub.subscribe({
      channels: [Object.values(CHANNELS)],
    });
  }
}

module.exports = PubSub;
