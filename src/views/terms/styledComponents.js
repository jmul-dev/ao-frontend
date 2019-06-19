import styled from "styled-components";
import { Link } from "react-router-dom";

export const Wrapper = styled.div`
	padding: 60px;
	font-size: 1em;
	line-height: 1.6em;
`;

export const Title = styled.div`
	font-weight: 600;
	font-size: 2em;
	text-transform: uppercase;
	margin: 60px 0px;
	text-align: center;
`;

export const Description = styled.div`
	font-weight: 600;
	font-size: 0.6em;
	margin: 20px 0;
	text-align: center;
	text-transform: capitalize;
`;

export const Header = styled.div`
	text-transform: uppercase;
	margin-bottom: 40px;
`;

export const Section = styled.div`
	margin-bottom: 20px;

	&.center {
		text-align: center;
	}
`;

export const Ahref = styled(Link)`
	text-decoration: none;
	color: #02cc47;
	:hover {
		text-decoration: none;
		color: #6dce8d;
	}
`;
