import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import withUploadFormData from '../containers/withUploadFormData';
import { Redirect } from 'react-router-dom';
import { BackButton } from './UploadFormNavButtons';
import { compose } from 'react-apollo';
import withUserWallet from '../../wallet/containers/withUserWallet';
import PrimordialExchangeForm from '../../exchange/components/PrimordialExchangeForm';
import NetworkExchangeForm from '../../exchange/components/NetworkExchangeForm';


class UploadFormReload extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    componentDidMount() {
        this.props.updateLastReachedStep('pricing')  // For context we throw user back into pricing view
    }
    _navBack = () => {
        // this.context.router.history.goBack()
        this.context.router.history.replace('/app/view/upload/pricing')
    }
    componentWillReceiveProps( nextProps ) {
        const { wallet, form } = nextProps
        if ( wallet.networkTokenBalance.gte(form.networkTokensRequired) &&  wallet.primordialTokenBalance.gte(form.primordialTokensRequired) ) {
            this.context.router.history.replace('/app/view/upload/content')
        }
    }
    render() {
        const { form, wallet } = this.props
        if ( !form.video ) {
            return <Redirect to={'/app/view/upload/start'} />
        }
        const needsPrimordialTokens = wallet.primordialTokenBalance.lt(form.primordialTokensRequired)
        return (
            <div>      
                <Grid container spacing={16}>
                    <Grid item xs={8} style={{marginLeft: 'auto', marginRight: 'auto'}}> 
                        <div style={{border: '1px solid #ddd', borderRadius: 4, marginBottom: 16, overflow: 'hidden'}}>
                            {needsPrimordialTokens ? (
                                <PrimordialExchangeForm />
                            ) : (
                                <NetworkExchangeForm requiredTokenAmount={form.networkTokensRequired} />
                            )}
                        </div>                   
                        <nav className="upload-form-nav gutter-bottom">
                            <BackButton onClick={this._navBack}>{'back'}</BackButton>
                        </nav>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
export default compose(
    withUploadFormData,
    withUserWallet,
)(UploadFormReload)