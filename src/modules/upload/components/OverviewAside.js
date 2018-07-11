import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


const OverviewAside = ({form, includePricing = false}) => (
    <aside className="OverviewAside">
        <Paper style={{overflow: 'hidden', marginBottom: 8}}>
            <div className="video-preview" style={{backgroundImage: `url(${form.video.preview})`}}></div>
        </Paper>
        <Typography variant="body1" gutterBottom>
            {`file size: ${~~(form.video.size / 1000 / 1000)} MB`}
        </Typography>
        {includePricing ? (
            <div className="pricing-overview">
                {form.stake ? (
                    <Typography variant="body1">
                        {'your stake'}
                        <Typography variant="body1" component="span">
                            {`${form.stake}ao`}
                        </Typography>
                    </Typography>
                ) : null}
                {form.stake ? (
                    <Typography variant="body1">
                        {'you charge'}
                        <Typography variant="body1" component="span">
                            {`${form.stake}ao /view`}
                        </Typography>
                    </Typography>
                ) : null}
                {form.profit ? (
                    <Typography variant="body1">
                        {'you make'}
                        <Typography variant="body1" component="span">
                            {`${form.profit}% profits`}
                        </Typography>
                    </Typography>
                ) : null}
            </div>
        ) : null}        
    </aside>
)
export default OverviewAside