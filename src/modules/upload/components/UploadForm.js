// @flow
import React, { Component } from 'react';
import { UploadReducerType } from '../reducers/upload.reducer';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import FileUpload from '../components/FileUpload';
import TextInput from '../components/TextInput';


type Props = {
    upload: UploadReducerType,
    updateCurrentStep: (number) => void,
};

const STEPS = ['Video', 'Teaser', 'Featured Image', 'Title & Description']

export default class UploadForm extends Component<Props> {
    props: Props;
    _handleStepNav = (index) => {
        const { updateCurrentStep } = this.props
        // TODO: verifiy if user can nav to this step
        updateCurrentStep(index)
    }
    render() {
        const { currentStepIndex } = this.props.upload
        return (
            <div className="UploadForm">
                <div>{this._renderStep(currentStepIndex)}</div>
                <Stepper nonLinear activeStep={currentStepIndex}>
                    {STEPS.map((step, index) => (
                        <Step key={index}>
                            <StepButton
                                onClick={this._handleStepNav.bind(this, index)}
                                completed={currentStepIndex > index}
                            >
                                {step}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
            </div>
        );
    }
    _renderStep(index) {
        switch (index) {
            case 0:
                return (
                    <FileUpload inputName="video" />
                )
            case 1:
                return (
                    <FileUpload inputName="videoTeaser" />
                )
            case 2:
                return (
                    <FileUpload inputName="featuredImage" />
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
                    <div>{`Current step: ${index} - ${STEPS[index]}`}</div>
                )
                break;
        }
    }
}
