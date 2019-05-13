import SSC from "sscjs";

export default class SSCLoader {
  constructor() {
    // this.token_info = {};
    this.maintainer = ["virus707", "goldenticket", "jjm13"];
    this.ssc = new SSC("https://api.steem-engine.com/rpc/");
  }

  getInfo(symbol) {
    var ssc = this.ssc;
    var token_info = {};
    ssc.stream((err, res) => {});

    return new Promise((resolve, reject) => {
      ssc.find(
        "market",
        "metrics",
        { symbol: symbol },
        1000,
        0,
        [],
        (err, result) => {
          token_info = {
            lastPrice: result[0].lastPrice,
            volume: result[0].volume,
            highestBid: result[0].highestBid,
            lowestAsk: result[0].lowestAsk
          };
          if (err) reject(err);
          resolve(token_info);
        }
      );
    });
  }

  getHolders(symbol) {
    var ssc = this.ssc;
    var holders_info = [];
    var holders = [];
    return new Promise((resolve, reject) => {
      ssc.find(
        "tokens",
        "balances",
        { symbol: symbol },
        1000,
        0,
        [],
        (err, result) => {
          // filtering balance more than 0
          result = result.filter(item => item.balance * 1 > 0);
          result.sort(function(a, b) {
            return b.balance - a.balance;
          });
          var sumBalance = 0;
          /// add all balances
          for (const holder of result) {
            sumBalance = sumBalance + 1 * holder.balance;
          }
          /// remove maintainer balances
          for (const mt of this.maintainer) {
            var maintainer = this.findAccount(result, mt);
            if (maintainer !== undefined)
              sumBalance = sumBalance - maintainer.balance;
          }
          holders_info.push(sumBalance);
          console.log(sumBalance);

          /// calculate rate
          var holder_id = 0;
          for (const holder of result) {
            holder_id = holder_id + 1;
            holder.rate = holder.balance / sumBalance;
            for (const mt of this.maintainer) {
              if (holder.account === mt) holder.rate = 0;
            }
            var voting_rate = 1;
            if (holder.balance / 1000 > 45) voting_rate = voting_rate + 45;
            else voting_rate = voting_rate + Math.floor(holder.balance / 1000);
            holders.push({
              account: holder.account,
              balance: holder.balance,
              rate: holder.rate * 1,
              voting_rate: voting_rate,
              hid: holder_id
            });
          }
          if (err) reject(err);
          holders_info.push(holders);
          
          resolve(holders_info);

        }
      );
    });
  }

  findAccount = (holders, account) => {
    return holders.find(function(a) {
      return a.account === account;
    });
  };
}
