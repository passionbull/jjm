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
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
import AttachMoney from "@material-ui/icons/AttachMoney";
import SSCLoader from "../../presenter/SSCLoader.jsx";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

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

class Tableboard extends React.Component {
  state = {
    tokenInfo: 0,
    holders: [],
    holders_array: [],
    symbol: "JJM",
    holder_balance_sum: 0
  };

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  componentDidMount() {
    console.log("componentDidMount");
    var sscLoader = new SSCLoader();
    sscLoader.getInfo("JJM").then(result => {
      console.log("result", result);
      this.setState({ tokenInfo: result });
    });
    sscLoader.getHolders("JJM").then(info => {
      console.log("hds", info);
      var holder_balance_sum = info[0];
      var holders = info[1];
      var holders_array = holders.map(holder => {
        holder.rate = (100 * holder.rate).toFixed(3) + "%";
        holder.voting_rate = String(holder.voting_rate) + "%";
        holder.balance =
          (1 * holder.balance).toFixed(2) + " " + this.state.symbol;
        var array = Object.values(holder);
        return array.slice(0, 4);
      });
      this.setState({ holders, holders_array, holder_balance_sum });
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Holders</p>
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
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <AttachMoney />
                </CardIcon>
                <p className={classes.cardCategory}>Last Price</p>
                <h3 className={classes.cardTitle}>
                  {this.state.tokenInfo.lastPrice}
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
                <h4 className={classes.tableCardTitleWhite}>Token Info</h4>
                <p className={classes.tableCardTitleWhite}>
                  Last: {this.state.tokenInfo.lastPrice} STEEM, 24h Vol:{" "}
                  {this.numberWithCommas(this.state.tokenInfo.volume*1)} STEEM, Bid:{" "}
                  {this.state.tokenInfo.highestBid} STEEM, Ask:{" "}
                  {this.state.tokenInfo.lowestAsk} STEEM
                </p>
                <p className={classes.tableCardTitleWhite}>
                  Holders : {this.state.holders_array.length}
                </p>
                <p className={classes.tableCardTitleWhite}>
                  Sum of traffic :{" "}
                  {this.numberWithCommas(
                    this.state.holder_balance_sum.toFixed(2)
                  )}{" "}
                  JJM
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Account", "Balance", "Stake", "Voting Percent"]}
                  tableData={Object.values(this.state.holders_array)}

                  // tableData={[
                  //   ["Dakota Rice", "Niger", "Oud-Turnhout", "$36,738"],
                  //   ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
                  //   ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
                  //   [
                  //     "Philip Chaney",
                  //     "Korea, South",
                  //     "Overland Park",
                  //     "$38,735"
                  //   ],
                  //   [
                  //     "Doris Greene",
                  //     "Malawi",
                  //     "Feldkirchen in Kärnten",
                  //     "$63,542"
                  //   ],
                  //   ["Mason Porter", "Chile", "Gloucester", "$78,615"]
                  // ]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(dashboardStyle)(Tableboard);
