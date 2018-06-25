// @flow
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { NavLink } from 'react-router-dom';
import RegisterContainer from '../../modules/registration/containers/RegisterContainer'

const RegisterLayout = () => (
    <div className="RegisterLayout">
        <RegisterContainer />
    </div>
)
export default RegisterLayout