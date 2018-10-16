import React, { PureComponent } from 'react';
import View from '../View';
import Typography from '@material-ui/core/Typography';
import EtherscanLink from '../../modules/etherscan/EtherscanLink';



export default class DaoView extends PureComponent {
    render() {
        return (
            <View className={'DaoView'} padding="full">
                <header>
                    <Typography variant="subheading" gutterBottom>
                        {'The dAO'}
                    </Typography>
                </header>
                <section style={{marginTop: 48, opacity: 0.5}}>
                    <Typography variant="body1">
                        {`Abstract Order (“AO”) is governed by The Autonomous Organization (“The dAO”). The User Interface for The dAO is coming soon. However, the contracts and governance structure for the dAO already exists and is fully operational.`}
                        {`View the dAO contracts here: `}<EtherscanLink type="address" value={`TODO`} />
                    </Typography>
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
