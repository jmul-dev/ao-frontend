import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import '../styles/overview-aside.css';
import { TokenBalance, fromBaseToHighestDenomination } from '../../../utils/denominations'


const OverviewAside = ({form, includePricing = false}) => {
    const { amount, denomination } = fromBaseToHighestDenomination(form.video.size)
    return (
        <aside className="OverviewAside">
            <Paper style={{overflow: 'hidden', marginBottom: 16}}>
                <div className="video-preview" style={{backgroundImage: `url(${form.video.preview})`}}>
                    <video src={form.video.preview}></video>
                </div>
            </Paper>
            <Typography variant="caption" component="ul">
                <li>
                    <span>{'license'}</span>
                    <span className="divider"></span>
                    <b>{`${form.contentLicense}`}</b>
                </li>
                <li>
                    <span>{'file size'}</span>
                    <span className="divider"></span>
                    <b>{`${amount.toFixed(1)} ${denomination.fileSizeSuffix}`}</b>
                </li>
                <li style={{marginBottom: 24}}>
                    <span>{'min stake required'}</span>
                    <span className="divider"></span>
                    <b>{`${amount.toFixed(1)} ${denomination.prefix} AO`}</b>
                </li>
                {includePricing ? (
                    <React.Fragment>
                        <li>
                            <span>{'your stake'}</span>
                            <span className="divider"></span>
                            <b className="em-submit">
                                <TokenBalance baseAmount={form.stake} decimals={1} includeAO={true} />
                            </b>
                        </li>
                        <li>
                            <span>{'you charge'}</span>
                            <span className="divider"></span>
                            <b className="em-submit">
                                <TokenBalance baseAmount={form.stake} decimals={1} includeAO={true} />{` / view`}
                            </b>
                        </li>
                        <li>
                            <span>{'you make'}</span>
                            <span className="divider"></span>
                            <b className="em-submit">{`${form.profitSplitPercentage}% profits`}</b>
                        </li>
                    </React.Fragment>
                ) : null}
            </Typography>
        </aside>
    )
}
export default OverviewAside