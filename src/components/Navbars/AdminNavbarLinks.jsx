import React from "react";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Button2 from '@material-ui/core/Button';
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";
import steemConnect from "../../presenter/steemConnect";

class HeaderLinks extends React.Component {
  state = {
    open: false,
    sign_in: false
  };
  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  componentDidMount() {
    var link = window.location.href;
    console.log("nav", link);
    this.checkToken(link);
    this.getAsyncToken().then(token => {
      console.log("token",token);
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
          });
      }
    });
  }

  loginSteemConnect2 = () => {
    // Go to Commit screen
    if (this.state.sign_in === false) this.getLoginURL();
    else this.revokeToken();
  };
  getLoginURL = () => {
    let link = steemConnect.getLoginURL();
    window.location.href = link;
  };

  revokeToken = () => {
    steemConnect.revokeToken(function(err, res) {
      console.log(res);
      localStorage.token = null;
      this.setState({ sign_in: false });
    });
  };

  checkToken = url => {
    if (url.indexOf("?access_token") > -1) {
      try {
        const tokens = {};
        // 콜백 URL에서 accessToken 정보 추출하기
        let params = url.split("?")[1];
        params = params.split("&");
        params.forEach(e => {
          const [key, val] = e.split("=");
          tokens[key] = val;
        });
        console.log("tokens:", tokens);
        localStorage.token = tokens.access_token
      } catch (error) {
        console.log(error);
      }
    }
  };
  getAsyncToken = async () => {
    try {
      return localStorage.token;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <div>
        <div className={classes.searchWrapper}>
          <CustomInput
            formControlProps={{
              className: classes.margin + " " + classes.search
            }}
            inputProps={{
              placeholder: "Search",
              inputProps: {
                "aria-label": "Search"
              }
            }}
          />
          <Button color="white" aria-label="edit" justIcon round>
            <Search />
          </Button>
        </div>
        <Button2 onClick={this.loginSteemConnect2}>{this.state.sign_in === false? 'Sign in':'Sign out'}</Button2>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
