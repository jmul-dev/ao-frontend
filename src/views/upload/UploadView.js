// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import Typography from '@material-ui/core/Typography';
import UploadFormContainer from '../../modules/upload/containers/UploadFormContainer';


export default class UploadView extends PureComponent {
    render() {
        return (
            <View className={'UploadView'}>
                <header>
                    <Typography variant="display1" gutterBottom align="center">
                        {'Upload'}
                    </Typography>
                </header>
                <section>
                    <UploadFormContainer />
                </section>
            </View>
        );
    }
}
