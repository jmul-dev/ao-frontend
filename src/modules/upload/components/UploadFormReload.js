import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import withUploadFormData from "../containers/withUploadFormData";
import { Redirect } from "react-router-dom";
import { BackButton } from "./UploadFormNavButtons";
import { compose } from "react-apollo";
import withUserWallet from "../../wallet/containers/withUserWallet";
import PrimordialExchangeForm from "../../exchange/components/PrimordialExchangeForm";
import NetworkExchangeForm from "../../exchange/components/NetworkExchangeForm";
import Typography from "@material-ui/core/Typography";
import { TokenBalance } from "../../../utils/denominations";
import BigNumber from "bignumber.js";

class UploadFormReload extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    componentDidMount() {
        this.props.updateLastReachedStep("pricing"); // For context we throw user back into pricing view
    }
    _navBack = () => {
        // this.context.router.history.goBack()
        let backRoute = "pricing";
        if (
            this.props.history.location.search &&
            this.props.history.location.search.indexOf("license") > -1
        )
            backRoute = "license";
        this.context.router.history.replace(`/app/view/upload/${backRoute}`);
    };
    componentWillReceiveProps(nextProps) {
        const { wallet, form } = nextProps;
        if (
            wallet.networkTokenBalance.gte(form.networkTokensRequired) &&
            wallet.primordialTokenBalance.gte(form.primordialTokensRequired)
        ) {
            this.context.router.history.replace("/app/view/upload/content");
        }
    }
    render() {
        const { form, wallet } = this.props;
        if (!form.content) {
            return <Redirect to={"/app/view/upload/start"} />;
        }
        const needsPrimordialTokens = wallet.primordialTokenBalance.lt(
            form.primordialTokensRequired
        );
        const insufficientPrimordialAmount = needsPrimordialTokens
            ? new BigNumber(form.primordialTokensRequired).minus(
                  wallet.primordialTokenBalance
              )
            : new BigNumber(0);
        const needsNetworkTokens = wallet.networkTokenBalance.lt(
            form.networkTokensRequired
        );
        const insufficientNetworkAmount = needsNetworkTokens
            ? new BigNumber(form.networkTokensRequired).minus(
                  wallet.networkTokenBalance
              )
            : new BigNumber(0);
        return (
            <div>
                <Grid container spacing={16}>
                    <Grid
                        item
                        xs={8}
                        style={{ marginLeft: "auto", marginRight: "auto" }}
                    >
                        <Typography variant="headline">{`Insufficient balance`}</Typography>
                        <Typography variant="body1">
                            {`The amount you are trying to stake exceeds the balance of your wallet.`}
                            <br />
                            {insufficientPrimordialAmount.gt(0) && (
                                <TokenBalance
                                    baseAmount={insufficientPrimordialAmount}
                                    isPrimordial={true}
                                />
                            )}
                            {insufficientPrimordialAmount.gt(0) &&
                                insufficientNetworkAmount.gt(0) &&
                                " & "}
                            {insufficientNetworkAmount.gt(0) && (
                                <TokenBalance
                                    baseAmount={insufficientNetworkAmount}
                                    isPrimordial={false}
                                />
                            )}
                            {" required."}
                        </Typography>
                        <div
                            style={{
                                marginTop: 48,
                                marginBottom: 16,
                                overflow: "hidden"
                            }}
                        >
                            {needsPrimordialTokens ? (
                                <PrimordialExchangeForm />
                            ) : (
                                <NetworkExchangeForm
                                    requiredTokenAmount={
                                        form.networkTokensRequired
                                    }
                                />
                            )}
                        </div>
                        <nav className="upload-form-nav gutter-bottom">
                            <BackButton onClick={this._navBack}>
                                {"back"}
                            </BackButton>
                        </nav>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default compose(
    withUploadFormData,
    withUserWallet
)(UploadFormReload);
