import React, { PureComponent } from 'react';
import View from '../View';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


export default class DevelopersView extends PureComponent {
    render() {
        return (
            <View className={'DevelopersView'} padding="full">
                <header>
                    <Typography variant="subheading" gutterBottom>
                        {'Developers'}
                    </Typography>
                </header>
                <section style={{marginTop: 48, opacity: 0.5}}>
                    <List component="nav" style={{marginLeft: -24}}>
                        <ListItem button disabled>
                            <ListItemText primary="Overview" />
                        </ListItem>
                        <ListItem button disabled>
                            <ListItemText primary="Getting Started" />
                        </ListItem>
                        <ListItem button disabled>
                            <ListItemText primary="Documentation" />
                        </ListItem>
                        <ListItem button disabled>
                            <ListItemText primary="Examples" />
                        </ListItem>
                    </List>
                    <Typography variant="caption" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        fontSize: '32px',
                        transform: 'translate(-50%, -50%) rotate(-10deg)',
                    }}>
                        {'Coming soon...'}
                    </Typography>
                </section>
            </View>
        );
    }
}
