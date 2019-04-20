import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Danger from "components/Typography/Danger.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.jsx";
import LinearProgress from "@material-ui/core/LinearProgress";
// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";

import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
import AttachMoney from "@material-ui/icons/AttachMoney";
import Snackbar from "components/Snackbar/Snackbar.jsx";

import SSCLoader from "../../presenter/SSCLoader.jsx";
import steemController from "../../presenter/steemController";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import steemConnect from "../../presenter/steemConnect";
import serverFetcher from "../../presenter/serverFetcher";
var sc = new steemController();

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

class Votingboard extends React.Component {
  state = {
    tokenInfo: 0,
    holders: [],
    holders_array: [],
    symbol: "JJM",
    ActivePostDate: 7,
    updated: true,
    tc: false,
    notiMessage: "",
    prefix_text: [
      "Congratulations on your decision to become a holder in JJM. Did you know that the daily upvote is increasing for 1% for each 1000JJM you are holding? Get a max of 46% upvote from @virus707's 450K SP which would equal holding 45,000JJM.",
      "Thank you for considering investing your precious resources in JJM. JJM is a token based on steem-engine.com using a side chain of Steem. With a holding Steem Power of 500K SP owned and bought from @virus707, this SP is used in combination with JJM tokens to upvote, reward and distribute dividends out of the JJM project to JJM token holders.",
      "Thank you for your continued support towards JJM. For each 1000 JJM you are holding, you can get an additional 1% of upvote. 10,000JJM would give you a 11% daily voting from the 450K SP virus707 account."
    ],
    postingDateShowing: "",
    voterDateShowing: ""
  };

  actionVoting = () => {
    var holders = this.state.holders;
    this.setState({ updated: false }, () => {
      this.votedReculsive(holders, 0, holders.length, this);
    });
  };

  getWatingList = () => {
    console.log("getWaitingList");
    this.setState({ holderCnt: 0 });
    var holder_id = 0;

    var postingDate = new Date();
    postingDate.setDate(postingDate.getDate() - this.state.ActivePostDate);
    var postingDateShowing = postingDate.toLocaleString();
    postingDate = postingDate.toISOString().split(".")[0];

    var voterDate = new Date();
    voterDate.setDate(voterDate.getDate() - 1);
    var voterDateShowing = voterDate.toLocaleString();
    voterDate = voterDate.toISOString().split(".")[0];

    var holders = this.state.holders;
    holders = holders.filter(item => item.balance >= 100);

    this.setState({
      holders_size: holders.length,
      postingDateShowing,
      voterDateShowing
    });
    for (const holder of holders) {
      this.getPostingByBlog(
        holder.account,
        "",
        "",
        this,
        holder_id,
        holders,
        postingDate,
        voterDate,
        0
      );
      holder_id = holder_id + 1;
    }
  };

  updatedCallback(holders) {
    var cnt = this.state.holderCnt;
    cnt = cnt + 1;
    this.setState({ holderCnt: cnt }, () => {
      if (cnt === this.state.holders_size) {
        //filtering
        holders = holders.filter(item => item.voted !== true);
        holders = holders.filter(item => item.latest_posting_jjm !== "");
        holders = holders.filter(item => item.latest_posting_jjm !== undefined);
        holders = holders.filter(item => item.balance >= 100);
        //shallow copy
        var holders_array = [];
        holders_array = holders.map(holder => {
          var account = holder.account;
          var rate = (100 * holder.rate).toFixed(3) + "%";
          var voting_rate = String(holder.voting_rate) + "%";
          var balance =
            (1 * holder.balance).toFixed(2) + " " + this.state.symbol;
          var voted = holder.voted === true ? "true" : "false";
          var link =
            "https://busy.org/@" +
            holder.account +
            "/" +
            holder.latest_posting_jjm;
          var array = [account, rate, voting_rate, balance, link];
          return array;
        });
        console.log("updated", holders);
        this.setState({
          updated: true,
          holders,
          holders_array,
          tc: true,
          notiMessage: "I've got a list of people who have not been voted."
        });
        // window.alert('updated!');
      }
    });
  }

  getPostingByBlog(
    author,
    start_author = "",
    start_permlink = "",
    that,
    holder_id,
    holders,
    startDate,
    voterDate,
    c
  ) {
    const size = 50;
    var query = {
      tag: author,
      limit: size,
      start_author: start_author,
      start_permlink: start_permlink
    };
    sc.getDiscussionsByBlog(query).then(function(response) {
      var length_posts = response.length;
      var voted = false;
      var latest_posting_jjm = "";
      for (const post of response) {
        if (post.author === query.tag) {
          var json_meta = JSON.parse(post.json_metadata);
          var isJJM = json_meta.tags.find(function(a) {
            return a === "jjm";
          });
          if (post.created > voterDate && isJJM === "jjm") {
            if (voted === false) {
              voted = post.active_votes.find(function(a) {
                return a.voter === "virus707";
              });
            }
            if (c === 0) {
              latest_posting_jjm = post.permlink;
            }
            if (voted !== undefined) voted = true;
            else if (voted === undefined) voted = false;
            c = c + 1;
          }
        }
      }
      if (
        length_posts < size ||
        response[length_posts - 1].created < startDate
      ) {
        if (holders[holder_id].account === author) {
          holders[holder_id].voted = voted;
          holders[holder_id].latest_posting_jjm = latest_posting_jjm;
          console.log("message", holder_id, latest_posting_jjm);
          that.updatedCallback(holders);
        } else {
          console.log("something is wrong.");
        }
        return;
      }
      var start_author = response[length_posts - 1].author;
      var start_permlink = response[length_posts - 1].permlink;
      that.getPostingByBlog(
        author,
        start_author,
        start_permlink,
        that,
        holder_id,
        holders,
        startDate,
        voterDate,
        c
      );
    }).catch(function(e) {
      console.log("error1",e);
      var cnt = that.state.holderCnt;
      cnt = cnt + 1;
      that.setState({ holderCnt: cnt });      
    });
    
  }

  votedReculsive(list, index, length, that) {
    steemConnect.vote(
      that.state.steem_account,
      list[index].account,
      list[index].latest_posting_jjm,
      list[index].voting_rate * 100,
      function(err, res) {
        console.log("index", index, list[index].account);
        console.log("voting", err, res);
        var text =
          that.state.prefix_text[
            Math.floor(Math.random() * that.state.prefix_text.length)
          ];
        var permlink =
          "re-" +
          list[index].latest_posting_jjm +
          "-" +
          Math.floor(Date.now() / 1000);
        var jsonMetadata = {
          tags: ["jjm"]
        };

        // console.log( list[index].account, list[index].latest_posting_jjm, that.state.steem_account, permlink, '', text )
        steemConnect.comment(
          list[index].account,
          list[index].latest_posting_jjm,
          that.state.steem_account,
          permlink,
          "",
          text,
          jsonMetadata,
          function(err, res) {
            console.log("comment", err, res);
            index = index + 1;
            if (index === length) {
              // window.alert('updated!');
              that.setState({
                updated: true,
                tc: true,
                notiMessage: "Voting is finished."
              });
              return;
            }
            that.votedReculsive(list, index, length, that);
          }
        );
      }
    );
  }
  getSteemUser() {
    var token = localStorage.token;
    var that = this;
    console.log("token", token);
    if (token === null || token === undefined) {
      this.setState({ sign_in: false });
    } else {
      // AccessToken 셋팅
      steemConnect.setAccessToken(token);
      // 계정 정보 조회
      steemConnect
        .me()
        .then(({ account }) => {
          const { profile } = JSON.parse(account.json_metadata);
          console.log("profile", account);
          this.setState({ sign_in: true, steem_account: account.name });
        })
        .catch(function(e) {
          localStorage.token = null;
          that.setState({ sign_in: false });
        });
    }
  }

  componentDidMount() {
    console.log("componentDidMount");
    var sf = new serverFetcher();
    sf.getPreFixedMessage(this);
    this.getSteemUser();
    var sscLoader = new SSCLoader();
    this.setState({ updated: false });
    sscLoader.getHolders("JJM").then(holders => {
      console.log("hds", holders);
      this.setState({ holders }, () => {
        this.getWatingList();
      });
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Snackbar
          place="tc"
          color="primary"
          icon={AddAlert}
          message={this.state.notiMessage}
          open={this.state.tc}
          closeNotification={() => this.setState({ tc: false })}
          close
        />

        <Button
          type="button"
          color="primary"
          disabled={this.state.updated === true ? false : true}
          onClick={this.actionVoting}
        >
          {this.state.updated === true ? "Start Voting" : "Loading.."}
        </Button>
        {this.state.updated === true ? <div> </div> : <LinearProgress />}
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Holders waiting voting</p>
                <h3 className={classes.cardTitle}>
                  {this.state.holders_array.length}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.tableCardTitleWhite}>Holder Info</h4>
                <p className={classes.tableCardCategoryWhite}>
                  Latest Postings of holders after{" "}
                  {this.state.postingDateShowing}, have been not voted after{" "}
                  {this.state.voterDateShowing}.
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={[
                    "Account",
                    "Balance",
                    "Stake",
                    "Voting Percent",
                    "Link"
                  ]}
                  tableData={Object.values(this.state.holders_array)}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(dashboardStyle)(Votingboard);
