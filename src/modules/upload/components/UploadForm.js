// @flow
import React, { Component } from 'react';
import { UploadReducerType } from '../reducers/upload.reducer';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';


type Props = {
    upload: UploadReducerType
};

const STEPS = ['Video', 'Teaser', 'Featured Image', 'Title & Description']

export default class UploadForm extends Component<Props> {
    props: Props;
    render() {
        const { currentStepIndex } = this.props.upload
        return (
            <div className="UploadForm">
                <div>{`Current step: ${currentStepIndex} - ${STEPS[currentStepIndex]}`}</div>
                <Stepper activeStep={currentStepIndex}>
                    {STEPS.map((step, index) => (
                        <Step completed={currentStepIndex > index}>
                            <StepLabel key={step}>{step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
        );
    }
}
