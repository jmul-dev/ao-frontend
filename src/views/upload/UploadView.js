// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import { Route, Switch } from 'react-router-dom';
import UploadForm from '../../modules/upload/components/UploadForm';
import UploadFormLicenseView from '../../modules/upload/components/UploadFormLicenseView';
import UploadFormPricing from '../../modules/upload/components/UploadFormPricing';
import UploadFormReload from '../../modules/upload/components/UploadFormReload';
import UploadFormContent from '../../modules/upload/components/UploadFormContent';
import UploadFormSubmit from '../../modules/upload/components/UploadFormSubmit';
import UploadFormContinue from '../../modules/upload/containers/UploadFormContinue';
import './upload-view.css';
import withEthAddress from '../../modules/account/containers/withEthAddress';

class UploadView extends PureComponent {
    render() {
        const { ethAddress, match } = this.props
        return (
            <View className={'UploadView'} padding="full">
                {ethAddress ? (
                    <Switch>
                        <Route exact path="/app/view/upload/start" component={UploadForm} />                        
                        <Route exact path="/app/view/upload/license" component={UploadFormLicenseView} />
                        <Route exact path="/app/view/upload/pricing" component={UploadFormPricing} />
                        <Route exact path="/app/view/upload/reload" component={UploadFormReload} />
                        <Route exact path="/app/view/upload/content" component={UploadFormContent} />
                        <Route exact path="/app/view/upload/submit" component={UploadFormSubmit} />
                        {/* UploadFormContinue redirects to one of the routes above */}
                        <Route component={UploadFormContinue} />
                    </Switch>
                ) : (
                    <UploadForm asPlaceholder />
                )}
            </View>
        );
    }
}

export default withEthAddress(UploadView)