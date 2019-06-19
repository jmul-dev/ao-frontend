import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const CheckboxContainer = styled.div`
	display: inline-block;
	vertical-align: middle;
`;

const Icon = styled.svg`
	fill: none;
	stroke: white;
	stroke-width: 2px;
`;
// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
	border: 0;
	clip: rect(0 0 0 0);
	clippath: inset(50%);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	white-space: nowrap;
	width: 1px;
`;

const StyledCheckbox = styled.div`
	display: inline-block;
	width: 20px;
	height: 20px;
	background: ${(props) => (props.checked ? "#02CC47" : "#DEE0E3")}
	border-radius: 3px;
	transition: all 150ms;

	${HiddenCheckbox}:focus + & {
		box-shadow: 0 0 0 3px #6dce8d;
	}

	${Icon} {
		visibility: ${(props) => (props.checked ? "visible" : "hidden")}
	}
`;

export const Checkbox = ({ className, checked, ...props }) => (
	<CheckboxContainer className={className}>
		<HiddenCheckbox checked={checked} {...props} />
		<StyledCheckbox checked={checked}>
			<Icon viewBox="0 5 24 12">
				<polyline points="20 6 9 17 4 12" />
			</Icon>
		</StyledCheckbox>
	</CheckboxContainer>
);

export const CheckboxLabel = styled.span`
	margin-left: 8px;
	font-size: 0.875rem;
	font-family: Arimo;
	font-weight: bold;
`;

export const Ahref = styled(Link)`
	text-decoration: none;
	color: #02cc47;
	:hover {
		text-decoration: none;
		color: #6dce8d;
	}
`;
