// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import { Route, Switch } from 'react-router-dom';
import UploadForm from '../../modules/upload/components/UploadForm';
import UploadFormPricing from '../../modules/upload/components/UploadFormPricing';
import UploadFormReload from '../../modules/upload/components/UploadFormReload';
import UploadFormContent from '../../modules/upload/components/UploadFormContent';
import UploadFormContinue from '../../modules/upload/containers/UploadFormContinue';
import './upload-view.css';


export default class UploadView extends PureComponent {
    render() {
        return (
            <View className={'UploadView'}>
                <Switch>
                    <Route exact path="/app/view/upload/start" component={UploadForm} />
                    <Route exact path="/app/view/upload/pricing" component={UploadFormPricing} />
                    <Route exact path="/app/view/upload/reload" component={UploadFormPricing} />
                    <Route exact path="/app/view/upload/content" component={UploadFormContent} />
                    {/* UploadFormContinue redirects to one of the routes above */}
                    <Route component={UploadFormContinue} />
                </Switch>
            </View>
        );
    }
}
