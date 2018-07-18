// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import { Route, Switch } from 'react-router-dom';
import UploadForm from '../../modules/upload/components/UploadForm';
import UploadFormPricing from '../../modules/upload/components/UploadFormPricing';
import UploadFormReload from '../../modules/upload/components/UploadFormReload';
import UploadFormContent from '../../modules/upload/components/UploadFormContent';
import UploadFormSubmit from '../../modules/upload/components/UploadFormSubmit';
import UploadFormContinue from '../../modules/upload/containers/UploadFormContinue';
import './upload-view.css';
import withEthAddress from '../../modules/account/containers/withEthAddress';
import Typography from '@material-ui/core/Typography';
import UnlockIcon from '@material-ui/icons/LockOpen';


class UploadView extends PureComponent {
    render() {
        const { ethAddress } = this.props
        return (
            <View className={'UploadView'} padding="full">
                {ethAddress ? (
                    <Switch>
                        <Route exact path="/app/view/upload/start" component={UploadForm} />
                        <Route exact path="/app/view/upload/pricing" component={UploadFormPricing} />
                        <Route exact path="/app/view/upload/reload" component={UploadFormPricing} />
                        <Route exact path="/app/view/upload/content" component={UploadFormContent} />
                        <Route exact path="/app/view/upload/submit" component={UploadFormSubmit} />
                        {/* UploadFormContinue redirects to one of the routes above */}
                        <Route component={UploadFormContinue} />
                    </Switch>
                ) : (
                    <div>
                        <Typography variant="display3" gutterBottom style={{display: 'flex', alignItems: 'center'}}>
                            <UnlockIcon style={{marginRight: 8}} />{'Unlock your account to proceed'}
                        </Typography>
                        <UploadForm asPlaceholder />
                    </div>
                )}
            </View>
        );
    }
}

export default withEthAddress(UploadView)