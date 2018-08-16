// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IcoStats from '../../modules/ico/components/IcoStats';
import './ico-view.css';


export default class IcoView extends PureComponent {
    render() {
        return (
            <View className={'IcoView'} padding="full">
                <header>
                    <Typography variant="display3" gutterBottom>
                        {'Network Exchange'}
                    </Typography>
                </header>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <IcoStats />
                    </Grid>
                </Grid>                
            </View>
        );
    }
}
