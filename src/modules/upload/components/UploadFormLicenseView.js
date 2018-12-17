import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextInput from './TextInput';
import { AddIcon } from '../../../assets/Icons';
import withUploadFormData from '../containers/withUploadFormData';
import { Redirect } from 'react-router-dom';
import { BackButton } from './UploadFormNavButtons';
import OverviewAside from './OverviewAside';
import FileUpload from './FileUpload';
import { getPreferredTokenSplit } from '../../../utils/denominations';
import { PrimaryButton } from '../../../theme';
import BigNumber from 'bignumber.js';


class UploadFormLicenseView extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    componentDidMount() {
        this.props.updateLastReachedStep('license')
    }
    _navBack = () => {
        this.context.router.history.replace('/app/view/upload/start')
    }
    _navForward = () => {
        const { form, wallet } = this.props
        let nextRoute = '/app/view/upload/content'
        if ( form.contentLicense === 'AO' ) {
            nextRoute = '/app/view/upload/pricing'
        } else {
            // NOTE: we are automatically setting the stake amount in network OR primordial depending on user balance (network prefered).
            // This is because we skip the stake input stage, since stake amount is already fixed to file size.
            const {
                networkAmount,
                primordialAmount,
                isSufficient,
                insufficientAmount,
                splitPercentage,
                tokenType,
            } = getPreferredTokenSplit({
                preferredTokenType: 'network',
                targetAmount: new BigNumber(form.video.size),
                networkBalance: wallet.networkTokenBalance,
                primordialBalance: wallet.primordialTokenBalance,
            })
            if ( !isSufficient ) {
                nextRoute = '/app/view/upload/reload'
            } else {
                this.props.updatePricingOption(0, form.video.size, form.profitSplitPercentage, tokenType, splitPercentage)
                nextRoute = '/app/view/upload/content'
            }
        }
        this.context.router.history.push(nextRoute)
    }
    render() {
        const { form } = this.props
        if ( !form.video ) {
            return <Redirect to={'/app/view/upload/start'} />
        }
        return (
            <div>
                <Typography className="title" variant="subheading">
                    {`Video License`}
                </Typography>
                <Grid container spacing={16}>
                    <Grid item xs={3}>
                        <OverviewAside form={form} includePricing={false} />
                    </Grid>
                    <Grid item xs={8} style={{marginLeft: 'auto'}}>                    
                        <Grid container spacing={24} className="gutter-bottom">
                            <Grid item xs={6}>
                            </Grid>
                        </Grid>
                        <nav className="upload-form-nav gutter-bottom">
                            <BackButton onClick={this._navBack}>{'back'}</BackButton>
                            <PrimaryButton onClick={this._navForward}>{'continue'}</PrimaryButton>
                        </nav>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
export default withUploadFormData(UploadFormLicenseView)