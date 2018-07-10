// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import UploadFormContainer from '../../modules/upload/containers/UploadFormContainer';
import './upload-view.css';

export default class UploadView extends PureComponent {
    render() {
        return (
            <View className={'UploadView'}>
                <section>
                    <UploadFormContainer />
                </section>
            </View>
        );
    }
}
