// @flow
import React, { Component } from 'react';
import { UploadReducerType } from '../reducers/upload.reducer';
import FileUpload from '../components/FileUpload';
import TextInput from '../components/TextInput';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import '../styles/upload-form.css';


type Props = {
    upload: UploadReducerType,
    updateCurrentStep: (number) => void,
};

class UploadFormVideoInputs extends Component {
    render() {
        return (
            <FileUpload inputName="video" onInputChange={() => this.props.navToStep(1)}>
                <div className="video-input">
                    <Typography variant="display2" gutterBottom align="center">
                        {'drag and drop to upload'}
                    </Typography>
                    <Typography variant="caption" gutterBottom align="center">
                        {'mp4 or mov files'}
                    </Typography>
                    <Button variant="contained" style={{backgroundColor: 'white', marginTop: 24}}>
                        {'or choose a file'}
                    </Button>
                </div>
            </FileUpload>
        )
    }
}

const PricingInputCard = ({headline, label, stake, profit, selected, onClick}) => (
    <ButtonBase focusRipple className={`pricing-card ${selected ? 'selected' : ''}`} onClick={onClick}>
        <Typography variant="display3" className="headline">{headline}</Typography>
        <div className="pricing-table">
            <div>
                <Typography variant="caption">{'you stake'}</Typography>
                <Typography variant="body2">{`${stake}ao`}</Typography>
            </div>
            <div>
                <Typography variant="caption">{'you charge'}</Typography>
                <Typography variant="body2">{`${stake}ao`} <Typography variant="caption" style={{display: 'inline'}}>{'/view'}</Typography></Typography>
            </div>
            <div>
                <Typography variant="caption">{'you make'}</Typography>
                <Typography variant="body2">{`${profit}%`} <Typography variant="caption" style={{display: 'inline'}}>{'profits'}</Typography></Typography>
            </div>
        </div>
        <div className="label">
            <Typography>{label}</Typography>
        </div>
    </ButtonBase>
)
class UploadFormPricingInputs extends Component {
    render() {
        const { inputs } = this.props
        const fileSizeInMb = ~~(inputs.video.size / 1000 / 1000)
        return (
            <Grid container spacing={16}>
                <Grid item xs={3}>
                    <div className="video-preview" style={{backgroundImage: `url(${inputs.video.preview})`}}></div>
                    <Typography variant="body1">
                        {`file size: ${fileSizeInMb} MB`}
                    </Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography variant="body1" gutterBottom>
                        {'We’ve put together a few options based on your needs:'}
                    </Typography>
                    <Grid container spacing={16}>
                        <Grid item xs={4}>
                            <PricingInputCard 
                                headline={'new content creators'}
                                label={'great exposure'}
                                stake={fileSizeInMb}
                                profit={10}
                                selected={inputs.pricingOption === 1}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <PricingInputCard 
                                headline={'established content creators'}
                                label={'moderate pricing'}
                                stake={~~(fileSizeInMb * 1.4)}
                                profit={25}
                                selected={inputs.pricingOption === 2}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <PricingInputCard 
                                headline={'premium high demand content'}
                                label={'premium pricing'}
                                stake={~~(fileSizeInMb * 2.2)}
                                profit={60}
                                selected={inputs.pricingOption === 3}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>   
        )
    }
}


export default class UploadForm extends Component<Props> {
    props: Props;
    _navToStep = (index) => {
        const { updateCurrentStep } = this.props
        updateCurrentStep(index)
    }
    render() {
        const { currentStepIndex } = this.props.upload
        return (
            <div className="UploadForm">
                {this._renderStep(currentStepIndex)}
            </div>
        );
    }
    _renderStep(index) {
        const { form } = this.props.upload
        switch (index) {
            case 0:
                return (
                    <UploadFormVideoInputs 
                        navToStep={this._navToStep} 
                    />
                )
            case 1:
                return (
                    <UploadFormPricingInputs 
                        navToStep={this._navToStep} 
                        inputs={form}
                    />
                )
            case 2:
                return (
                    <Grid container spacing={16}>
                        <Grid item xs={4}>
                            <FileUpload inputName="videoTeaser" />
                            <FileUpload inputName="featuredImage" />
                        </Grid>                        
                    </Grid>                    
                )
            case 3:
                return (
                    <div>
                        <TextInput inputName="title" inputLabel="Title" />
                        <TextInput inputName="description" inputLabel="Description" />
                    </div>
                )
            default:
                return (
                    <div>{`Current step: ${index}`}</div>
                )
                break;
        }
    }
    _navToSecondInputs = () => {

    }
}