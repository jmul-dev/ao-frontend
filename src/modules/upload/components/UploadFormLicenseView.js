import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextInput from "./TextInput";
import { AddIcon } from "../../../assets/Icons";
import withUploadFormData from "../containers/withUploadFormData";
import withUserWallet from "../../wallet/containers/withUserWallet";
import { Redirect } from "react-router-dom";
import { BackButton } from "./UploadFormNavButtons";
import OverviewAside from "./OverviewAside";
import FileUpload from "./FileUpload";
import { getPreferredTokenSplit } from "../../../utils/denominations";
import { PrimaryButton } from "../../../theme";
import BigNumber from "bignumber.js";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { compose } from "react-apollo";
import { contentSize } from "../reducers/upload.reducer";

class UploadFormLicenseView extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    componentDidMount() {
        this.props.updateLastReachedStep("license");
    }
    _navBack = () => {
        this.context.router.history.replace("/app/view/upload/start");
    };
    _navForward = () => {
        const { form, wallet } = this.props;
        let nextRoute = "/app/view/upload/content";
        if (form.contentLicense === "AO") {
            nextRoute = "/app/view/upload/pricing";
        } else {
            // NOTE: we are automatically setting the stake amount in network OR primordial depending on user balance (network prefered).
            // This is because we skip the stake input stage, since stake amount is already fixed to file size.
            const contentSizeInBytes = contentSize(form.content);
            const {
                networkAmount,
                primordialAmount,
                isSufficient,
                insufficientAmount,
                splitPercentage,
                tokenType
            } = getPreferredTokenSplit({
                preferredTokenType: "network",
                targetAmount: new BigNumber(contentSizeInBytes),
                networkBalance: wallet.networkTokenBalance,
                primordialBalance: wallet.primordialTokenBalance
            });
            if (!isSufficient) {
                nextRoute = "/app/view/upload/reload";
            } else {
                this.props.updatePricingOption(
                    0,
                    contentSizeInBytes,
                    form.profitSplitPercentage,
                    tokenType,
                    splitPercentage
                );
                nextRoute = "/app/view/upload/content";
            }
        }
        this.context.router.history.push(`${nextRoute}?from=license`);
    };
    _onContentLicenseChange = event => {
        this.props.updateUploadFormField("contentLicense", event.target.value);
    };
    render() {
        const { form } = this.props;
        if (!form.content) {
            return <Redirect to={"/app/view/upload/start"} />;
        }
        return (
            <div>
                <Typography className="title" variant="subheading">
                    {`Content License`}
                </Typography>
                <Grid container spacing={16}>
                    <Grid item xs={3}>
                        <OverviewAside form={form} includePricing={false} />
                    </Grid>
                    <Grid item xs={8} style={{ marginLeft: "auto" }}>
                        <Typography
                            variant="subheading"
                            className="gutter-bottom"
                        >
                            {
                                "Please select the appropriate content licensing for use within the AO network:"
                            }
                        </Typography>
                        <RadioGroup
                            name="contentLicense"
                            value={form.contentLicense}
                            onChange={this._onContentLicenseChange}
                        >
                            <FormControlLabel
                                value="AO"
                                control={<Radio color="primary" />}
                                label="AO (recommended)"
                            />
                            <FormControlLabel
                                value="TAO"
                                control={<Radio color="primary" />}
                                label="TAO (see The AO tab for more information)"
                            />
                            <FormControlLabel
                                value="CC"
                                control={<Radio color="primary" />}
                                label="Creative Commons"
                            />
                        </RadioGroup>
                        {/* <Grid container spacing={24} className="gutter-bottom">
                            <Grid item xs={6}>
                            </Grid>
                        </Grid> */}
                        <nav className="upload-form-nav gutter-bottom">
                            <BackButton onClick={this._navBack}>
                                {"back"}
                            </BackButton>
                            <PrimaryButton onClick={this._navForward}>
                                {"continue"}
                            </PrimaryButton>
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
)(UploadFormLicenseView);
