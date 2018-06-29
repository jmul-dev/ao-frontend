// @flow
import React, { PureComponent } from 'react';
import View from '../View';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Clock from '../../modules/clock/components/Clock';
import './browse-view.css';


export default class BrowseView extends PureComponent {
    render() {
        return (
            <View className={'BrowseView'}>
                <header>
                    <Clock />
                    <div>[stats]</div>
                    <div style={{marginLeft: 'auto'}}>
                        <Button>
                            <SearchIcon />
                        </Button>
                    </div>
                </header>
            </View>
        );
    }
}
