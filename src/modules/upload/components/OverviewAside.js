import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import '../styles/overview-aside.css';


const OverviewAside = ({form, includePricing = false}) => (
    <aside className="OverviewAside">
        <Paper style={{overflow: 'hidden', marginBottom: 16}}>
            <div className="video-preview" style={{backgroundImage: `url(${form.video.preview})`}}>
                <video src={form.video.preview}></video>
            </div>
        </Paper>
        <Typography variant="caption" component="ul">
            <li>
                <span>{'file size'}</span>
                <span className="divider"></span>
                <b>{`${~~(form.video.size / 1000 / 1000)} MB`}</b>
            </li>
            <li style={{marginBottom: 24}}>
                <span>{'min stake required'}</span>
                <span className="divider"></span>
                <b>{`${~~(form.video.size / 1000 / 1000)} AO`}</b>
            </li>
            {includePricing ? (
                <React.Fragment>
                    <li>
                        <span>{'your stake'}</span>
                        <span className="divider"></span>
                        <b className="em-submit">{`${form.stake} AO`}</b>
                    </li>
                    <li>
                        <span>{'you charge'}</span>
                        <span className="divider"></span>
                        <b className="em-submit">{`${form.stake} AO / view`}</b>
                    </li>
                    <li>
                        <span>{'you make'}</span>
                        <span className="divider"></span>
                        <b className="em-submit">{`${form.profit}% profits`}</b>
                    </li>
                </React.Fragment>
            ) : null}
        </Typography>
    </aside>
)
export default OverviewAside