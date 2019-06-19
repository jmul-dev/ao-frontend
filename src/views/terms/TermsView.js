import React, { PureComponent } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { lightTheme } from "../../theme";
import { Wrapper, Title, Description, Header, Section, Ahref } from "./styledComponents";

export default class TermsView extends PureComponent {
	render() {
		const style = {
			backgroundColor: lightTheme.palette.background.default,
			position: "absolute",
			height: "100%",
			width: "100%",
			overflow: "auto"
		};

		return (
			<MuiThemeProvider theme={lightTheme}>
				<section className="section-padding bg-shapes-white" style={style}>
					<Wrapper>
						<Title>Global AO+ Ion Exchange Terms</Title>
						<Header>
							PLEASE READ THESE ION EXCHANGE TERMS CAREFULLY. NOTE THAT SECTION 20 CONTAINS A BINDING ARBITRATION CLAUSE AND CLASS ACTION WAIVER, WHICH MAY AFFECT YOUR LEGAL RIGHTS. IF YOU DO NOT AGREE TO THESE TERMS OF SALE, DO NOT PURCHASE IONS.
						</Header>
						<Section>
							Your purchase of AO+ (<b>"Ions"</b>) during the Ion Sale (as defined below) from the AO Protocol, an Unincorporated Decentralized Autonomous Organization ( the <b>"AO"</b>) is subject to these terms of sale and use (<b>"Terms"</b>). Each of you and the AO is a <b>"Party"</b> and, together, the <b>"Parties."</b><br />
							By purchasing Ions from AO during the Ion Exchange, you will be bound by these Terms and all terms incorporated by reference.
						</Section>
						<Section>
							<div>
								You and AO agree as follows:
							</div>
							<ol>
								<li>
									<b>Ions</b>. AO intends to create a total of [6 x 10<sup>15</sup>] of AO+ Ions but reserves the right to increase or decrease this figure according to the Constitution of AO. [3 x 10<sup>15</sup>] Ions of AO+ (the <b>"Primordial Ions"</b>) will be made available for public sale through the process described in these Terms (the <b>"Ion Sale"</b>). For each Ion of AO+ sold to the public, one Ion will be distributed to the buyer and one distributed to AO Contributors.
								</li>
								<li>
									<b>Commencement and Duration of Ion Sale</b>. The Ion Sale will begin on or about July 1<sup>st</sup>, 2019 and end when the Ion Sale Limit (as defined in Exhibit B) has been reached. AO reserves the right to postpone the scheduled start date of the Ion Sale if required by events beyond the control of AO.
								</li>
								<li>
									<b>Eligibility to Participate in the Ion Sale</b>. In order to be eligible to participate in the Ion Sale, you must comply with all the terms and conditions set forth in these Terms.
								</li>
								<li>
									<b>Purchase and Sale of Exchange Ions During the Ion Exchange.</b><br />
									<ol type="a">
										<li>
											The price, terms, and conditions governing the purchase and sale of Ions in the Ion Exchange are set forth in Exhibit B of these Terms.
										</li>
										<li>
											<b>Binding Purchase</b>. You acknowledge and agree that your acceptance of these Terms and your transmission of payment in your chosen Purchase Currency (as defined in Exhibit B) constitutes a binding present obligation to purchase the corresponding quantity of Ions.
										</li>
									</ol>
								</li>
								<li>
									<b>Delivery of Sale Ions</b>. Provided you have a valid Ion Receipt Address (as defined in Exhibit B), AO will deliver the Ions you purchase during the Ion Sale to you as soon as possible following the purchase.
								</li>
								<li>
									<b>Purpose and Use of Ions in the AO Network; Possible Migration of Ions.</b><br />
									<ol type="a">
										<li>
											The purpose of the Ions is to grant access to hosting and/or buying information on the AO Network (the <b>"Utility"</b>), as detailed in the The Primordial Thought of AO attached as Exhibit C (the <b>"The Primordial Thought of AO"</b>). While AO intends to deploy additional features as described in the The Primordial Thought of AO, AO make no guarantees as to the completion of additional features. AO reserve the right to develop the AO Network in a manner that varies from its current intent as AO believe is necessary or desirable in light of practical or technical considerations.
										</li>
										<li>
											Purchase, ownership, receipt, or possession of Ions carries no rights, express or implied, other than the right to use Ions as a means to enable usage of the AO Network. In particular, you understand and accept that Ions do not represent or confer any ownership right or stake, share, security, or equivalent rights, or any right to receive future revenue shares, intellectual property rights or any other form of participation in or relating to the AO Network. The Ions are not intended to be a security or a regulated commodity interest, and you agree and acknowledge that you are purchasing the Ions for use with the AO Network and not for speculative investment purposes or financial gain, and accordingly, these Terms do not constitute any invitation to subscribe for any securities.
										</li>
										<li>
											The Ions will be accessible at the address you make the exchange transaction from as AO Network compliant Ions.
										</li>
										<li>
											AO reserves the right to migrate and or replicate the Ions to another protocol and/or network in the future should AO determine, in its reasonable discretion, that doing so is necessary or desirable. Upon AO's request, you agree to take any and all actions reasonably necessary to effectuate the migration of your Ions to another protocol identified by AO. If you fail to effectuate such migration, the Ions may not be compatible with the AO Network or the Utility going forward. Notwithstanding any other provision of these Terms, AO shall not be responsible or liable for any damages, losses, costs, fines, penalties or expenses of whatever nature, whether or not reasonably foreseeable by the Parties, which you may suffer, sustain, or incur, arising out of or relating to your failure to effectuate such migration of your Ions to another protocol identified by AO.
										</li>
									</ol>
								</li>
								<li>
									<b>AO+ Multiplier.</b><br />
									<ol type="a">
										<li>
											The AO+ multiplier is a mechanic that increases the amount of AO generated when an information transaction takes place.  When information is staked to the AO Network with AO+, the multiplier associated to that AO+ is multiplied by the inflation rate set by The AO's DAO.  For example, if a 1 mb video is stakes to the Network with AO+ that has a 10x multiplier and the inflation rate of the Network is set to 3%, then 30 Kilo AO would normally be created through inflation and distributed between the Creator and the Node(s).  However, with a 10x multiplier of staked AO+, then it would be 300 Kilo AO.
										</li>
									</ol>
								</li>
								<li>
									<b>Scope.</b><br />
									<ol type="a">
										<li>
											Unless otherwise stated herein, these Terms only govern your purchase of Exchange Ions from AO during the Ion Exchange.
										</li>
										<li>
											Any use of Ions in connection with providing or receiving AO Network Utilities will be governed by other applicable terms and conditions and policies of AO or third parties.
										</li>
									</ol>
								</li>
								<li>
									<b>Cancellation; Refusal of Purchase Requests.</b> All Sale Ion purchases from AO are final, and there are no refunds or cancellations, except as expressly provided in these Terms or as may be required by applicable law or regulation. AO reserves the right to refuse or cancel Sale Ion purchase requests at any time in its sole discretion.
								</li>
								<li>
									<b>Ion Allocation.</b> Important information about AO's creation and intended use of the Ions is provided in Exhibit A. By purchasing Sale Ions, you acknowledge that you have read and understand Exhibit A.
								</li>
								<li>
									<b>Acknowledgment and Assumption of Risks.</b> You acknowledge and agree that there are risks associated with purchasing Exchange Ions, owning Exchange Ions, and using Exchange Ions for the provision or receipt of Utilities and/or accessing the AO Network, including without limitation as disclosed and explained in Exhibit F. BY PURCHASING SALE IONS, YOU EXPRESSLY ACKNOWLEDGE AND ASSUME THESE RISKS.
								</li>
								<li>
									<b>Security.</b> You are responsible for implementing reasonable measures for securing your Ion Receipt Address and the wallet software you use to access that address, and any other address, wallet, vault or other storage mechanism you use to receive, hold, or access Sale Ions purchased from AO, including any requisite private key(s) or other credentials necessary to access such storage mechanism(s). If your private key(s) or other access credentials are lost, you may lose access to your Sale Ions. Notwithstanding any other provision of these Terms, AO shall not be responsible or liable for any damages, losses, costs, penalties, fines, or expenses arising out of or relating to (i) your failure to implement reasonable measures to secure the wallet, vault or other storage mechanism you use to receive and hold Sale Ions or the relevant access credentials; or (ii) the loss of or unauthorized use of any of your access credentials.
								</li>
								<li>
									<b>Personal Information.</b> The AO may determine, in its sole discretion, that it is necessary to obtain certain information about you or (if relevant) your beneficiaries, shareholders, beneficial owners, partners, directors, officers, or any other individuals connected to you in order to comply with applicable laws or regulations or requests of any regulator in any relevant jurisdiction, in connection with selling Exchange Ions to you or providing the Services. You agree to provide AO such information promptly upon request, and any information you provide in respect of any third-party individuals may be collected, used, and disclosed by AO in order for AO or its Affiliates to comply with laws or regulations or requests of any regulator in any relevant jurisdiction. You acknowledge that AO may refuse to sell Exchange Ions to you or to provide Utilities, until you provide such requested information and AO has determined that it is permissible to sell you Exchange Ions and to provide the Utilities under applicable laws or regulations.
								</li>
								<li>
									<b>Taxes.</b> Any amounts that you pay for Exchange Ions are exclusive of all applicable taxes. You are responsible for determining what, if any, taxes apply to your purchase of Sale Ions, including, for example, sales, use, value added, and similar taxes. It is your responsibility to withhold, collect, report, and remit the correct taxes to the appropriate tax authorities. AO is not responsible for withholding, collecting, reporting, or remitting any sales, use, value added, or similar tax arising from your purchase of Sale Ions.
								</li>
								<li>
									<b>AO Representations and Warranties.</b> AO represents and warrants that:<br />
									<ol type="a">
										<li>
											AO is an unincorporated decentralized autonomous organization managed by an autonomous protocol agreed to by nodes running on a public network.
										</li>
										<li>
											The performance by AO of these Terms is within the power of AO and, other than with respect to the actions to be taken when Exchange Ions are to be sold to you, has been duly authorized by all necessary actions on the part of AO. These Terms constitute a legal, valid, and binding obligation of AO, enforceable against AO in accordance with its terms, except as limited by bankruptcy, insolvency, or other laws of general application relating to or affecting the enforcement of creditors' rights generally and general principles of equity. To the knowledge of AO, it is not in violation of (i) its Constitution, (ii) any material statute, rule, or regulation applicable to AO or (iii) any material indenture or contract to which AO is a party or by which it is bound, where, in each case, such violation or default, individually, or together with all such violations or defaults, could reasonably be expected to have a material adverse effect on AO.
										</li>
										<li>
											The performance and consummation of the transactions contemplated by these Terms do not and will not (i) violate any material judgment, statute, rule, or regulation applicable to AO, (ii) result in the acceleration of any material indenture or contract to which AO is a party or by which it is bound, or (iii) result in the creation or imposition of any lien upon any property, asset, or revenue of AO or the suspension, forfeiture, or non-renewal of any material permit, license, or authorization applicable to AO, its business or operations.
										</li>
									</ol>
								</li>
								<li>
									<b>Your Representations and Warranties.</b> You represent and warrant that:<br />
									<ol type="a">
										<li>
											You have sufficient understanding of technical and practical matters (including those that relate to the Services and AO Network), cryptographic Ions, Ion storage mechanisms (such as Ion wallets), and blockchain technology to understand these Terms and to appreciate the risks and implications of purchasing the Sale Ions;
										</li>
										<li>
											You have read and understand the terms and conditions of these Terms (including all exhibits which are part of these Terms);
										</li>
										<li>
											You have access to The Primordial Thought of AO;
										</li>
										<li>
											You understand the restrictions and risks associated with the creation of Ions as set forth herein, and acknowledge and assume all such risks;
										</li>
										<li>
											You have obtained sufficient information about the Ions, the Utilities and the AO Network to make an informed decision to purchase the Sale Ions;
										</li>
										<li>
											You understand that the Ions confer only the right to receive Utilities in the AO Network and confer no other rights of any form with respect to the network or AO, including, but not limited to, any ownership, distribution, redemption, liquidation, proprietary (including all forms of intellectual property), or other financial or legal rights;
										</li>
										<li>
											You are purchasing Exchange Ions solely for the purpose of receiving Utilities, participating in the AO Network, and supporting the development, testing, deployment and operation of the AO Network, being aware of the risks associated with AO and the AO Network. You are not purchasing Exchange Ions for any other purposes, including, but not limited to, any investment, speculative, or financial purpose;
										</li>
										<li>
											Your purchase of Sale Ions complies with applicable laws and regulations in your jurisdiction, including, but not limited to, (i) legal capacity and any other threshold requirements in your jurisdiction for the purchase of the Sale Ions and entering into contracts with AO, (ii) any governmental or other restrictions on the purchase or sale of the Sale Ions, (iii) any foreign exchange or regulatory restrictions applicable to such purchase, and (iv) any governmental or other consents that may need to be obtained;
										</li>
										<li>
											You understand and acknowledge that AO is not registered with or licensed by any financial regulatory authority. Accordingly, no financial regulatory authority has passed upon the contents of these Terms or the merits of purchasing Sale Ions, nor have these Terms been filed with, or reviewed by any financial regulatory authority.
										</li>
										<li>
											You understand and acknowledge that these Terms shall not be construed as an invitation to subscribe for any securities, and you understand and acknowledge that no actions of, or documentation issued by AO, shall be construed as such.
										</li>
										<li>
											You will comply with any applicable tax obligations in your jurisdiction arising from your purchase of Sale Ions;
										</li>
										<li>
											If you are purchasing Sale Ions on behalf of any entity, you are authorized to accept these Terms on such entity's behalf, and such entity will be responsible for breach of these Terms by you or any other employee or agent of such entity (references to "you" in these Terms refer to you and such entity, jointly);
										</li>
										<li>
											You hereby certify that you are not (i) a citizen or resident of a geographic area in which use of the AO in connection with Protocol Utility is prohibited by applicable law, decree, regulation, treaty, or administrative act, (ii) a citizen or resident of, or located in, a geographic area that is subject to U.S. or other applicable sanctions or embargoes, or (iii) an individual, or an individual employed by or associated with an entity, identified on the U.S. Department of Commerce's Denied Persons or Entity List, the U.S. Department of Treasury's Specially Designated Nationals List, the U.S. Department of State's Debarred Parties List or other applicable sanctions lists. You hereby represent and agree that if your country of residence or other circumstances change such that the above representations are no longer accurate, you will immediately notify AO and cease using AO. Finally, you agree that you will not knowingly forward the Ions to a party subject to U.S. or other applicable sanctions; and
										</li>
										<li>
											You will at all times maintain control of your Ion Receipt Address and the private key and/or any account credentials associated with the Ion Receipt Address, and will not share or disclose the private key or account credentials with any other party. If you transfer the Ions to another address, you will similarly maintain control of, and not share or disclose the private key or account credentials for, such other address.
										</li>
									</ol>
								</li>
								<li>
									<b>Indemnification.</b><br />
									<ol type="a">
										<li>
											To the fullest extent permitted by applicable law, you will indemnify, defend, and hold harmless AO and its respective past, present, and future employees, user, members, holders, contributors, volunteers, officers, directors, contractors, consultants, suppliers, vendors, service providers, parent companies, subsidiaries, affiliates, agents, representatives, predecessors, successors, and assigns (the <b>"AO Parties"</b>) from and against all claims, demands, actions, damages, losses, costs, and expenses (including attorneys' fees) that arise from or relate to: (i) your purchase or use of Ions, (ii) you responsibilities or obligations under these Terms, (iii) your violation of these Terms, or (iv) your violation of any rights of any applicable law or the other person or entity.
										</li>
										<li>
											AO reserves the right to exercise sole control over the defense, at your expense, of any claim subject to indemnification under Section 16(a). This indemnity is in addition to, and not in lieu of, any other indemnities set forth in a written agreement between you and AO.
										</li>
									</ol>
								</li>
								<li>
									<b>Disclaimers.</b><br />
									<ol type="a">
										<li>
											TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, (A) THE SALE IONS ARE SOLD ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, AND AO EXPRESSLY DISCLAIMS ALL IMPLIED WARRANTIES AS TO THE SALE IonS, INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT, (B) AO DOES NOT REPRESENT OR WARRANT THAT THE SALE IONS ARE RELIABLE, CURRENT OR ERROR-FREE, MEET YOUR REQUIREMENTS, OR THAT DEFECTS IN THE EXCHANGE IONS WILL BE CORRECTED, AND (C) AO CANNOT AND DOES NOT REPRESENT OR WARRANT THAT THE SALE IonS OR THE DELIVERY MECHANISM FOR SALE IONS ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
										</li>
										<li>
											Some jurisdictions do not allow the exclusion of certain warranties or disclaimer of implied terms in contracts with consumers, so some or all of the exclusions of warranties and disclaimers in this Section 17 may not apply to you.
										</li>
									</ol>
								</li>
								<li>
									<b>Limitation of Liability.</b><br />
									<ol type="a">
										<li>
											TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW (i) IN NO EVENT WILL AO BE LIABLE FOR LOSS OF PROFITS OR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES OF ANY KIND (INCLUDING, BUT NOT LIMITED TO, WHERE RELATED TO LOSS OF REVENUE, INCOME OR PROFITS, LOSS OF USE OR DATA, OR DAMAGES FOR BUSINESS INTERRUPTION) ARISING OUT OF OR IN ANY WAY RELATED TO THE SALE OR USE OF THE SALE IonS OR OTHERWISE RELATED TO THESE TERMS, REGARDLESS OF THE FORM OF ACTION, WHETHER BASED IN CONTRACT, TORT (INCLUDING, BUT NOT LIMITED TO, SIMPLE NEGLIGENCE, WHETHER ACTIVE, PASSIVE OR IMPUTED), OR ANY OTHER LEGAL OR EQUITABLE THEORY (EVEN IF THE PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE), AND (ii) IN NO EVENT WILL THE AGGREGATE LIABILITY OF AO AND AO PARTIES (JOINTLY), WHETHER IN CONTRACT, WARRANTY, TORT (INCLUDING NEGLIGENCE, WHETHER ACTIVE, PASSIVE, OR IMPUTED), OR OTHER THEORY, ARISING OUT OF OR RELATING TO THESE TERMS OR THE USE OF OR INABILITY TO USE THE SALE IONS, EXCEED THE U.S. DOLLAR EQUIVALENT OF THE AMOUNT YOU PAID TO AO FOR THE SALE IONS AS VALUED AT THE TIME OF YOUR PURCHASE.
										</li>
										<li>
											THE LIMITATIONS SET FORTH IN SECTION 18(a) WILL NOT LIMIT OR EXCLUDE LIABILITY FOR THE GROSS NEGLIGENCE, FRAUD OR INTENTIONAL, WILLFUL OR RECKLESS MISCONDUCT OF AO.
										</li>
										<li>
											Some jurisdictions do not allow the limitation or exclusion of liability for incidental or consequential damages. Accordingly, some of the limitations of this Section 18 may not apply to you.
										</li>
									</ol>
								</li>
								<li>
									<b>Release.</b> To the fullest extent permitted by applicable law, you release AO and the other AO Parties from responsibility, liability, claims, demands, and/or damages (actual and consequential) of every kind and nature, known and unknown (including, but not limited to, claims of negligence), arising out of or related to disputes between users and the acts or omissions of third parties. You expressly waive any rights you may have under California Civil Code § 1542 as well as any other statute or common law principles, and including similar laws in other applicable jurisdictions, that would otherwise limit the coverage of this release to include only those claims which you may know or suspect to exist in your favor at the time of agreeing to this release.
								</li>
								<li>
									<b>Dispute Resolution; Arbitration.</b> PLEASE READ THE FOLLOWING SECTION CAREFULLY BECAUSE IT CONTAINS ADDITIONAL PROVISIONS APPLICABLE ONLY TO INDIVIDUALS LOCATED, RESIDENT, OR DOMICILED IN THE UNITED STATES. IF YOU ARE LOCATED, RESIDENT, OR DOMICILED IN THE UNITED STATES, THIS SECTION REQUIRES YOU TO ARBITRATE CERTAIN DISPUTES AND CLAIMS WITH AO AND LIMITS THE MANNER IN WHICH YOU CAN SEEK RELIEF FROM US.<br />
									<ol type="a">
										<li>
											<b>Binding Arbitration.</b> Except for any disputes, claims, suits, actions, causes of action, demands or proceedings (collectively, <b>"Disputes"</b>) in which either Party seeks to bring an individual action in small claims court or seeks injunctive or other equitable relief for the alleged unlawful use of intellectual property, including, without limitation, copyrights, trademarks, trade names, logos, trade secrets, or patents, you and AO (i) waive your and AO's respective rights to have any and all Disputes arising from or related to these Terms resolved in a court, and (ii) waive your and AO's respective rights to a jury trial. Instead, you and AO will arbitrate Disputes through binding arbitration (which is the referral of a Dispute to one or more persons charged with reviewing the Dispute and making a final and binding determination to resolve it instead of having the Dispute decided by a judge or jury in court).
										</li>
										<li>
											<b>No Class Arbitrations, Class Actions or Representative Actions.</b> Any Dispute arising out of or related to these Terms is personal to you and AO and will be resolved solely through individual arbitration and will not be brought as a class arbitration, class action or any other type of representative proceeding. There will be no class arbitration or arbitration in which an individual attempts to resolve a Dispute as a representative of another individual or group of individuals. Further, a Dispute cannot be brought as a class or other type of representative action, whether within or outside of arbitration, or on behalf of any other individual or group of individuals.
										</li>
										<li>
											<b>Federal Arbitration Act.</b> These Terms affect interstate commerce and the enforceability of this Section 20 will be both substantively and procedurally governed by and construed and enforced in accordance with the Federal Arbitration Act, 9 U.S.C. § 1 et seq. (the <b>"FAA"</b>), to the maximum extent permitted by applicable law.
										</li>
										<li>
											<b>Notice; Informal Dispute Resolution.</b> Each Party will notify the other Party in writing of any arbitrable or small claims Dispute within thirty (30) days of the date it arises, so that the Parties can attempt in good faith to resolve the Dispute through the AO Network. Notice to AO shall be sent by [email, comment board, etc]. Notice to you shall be by email to the email address provided to AO. Your notice must include (i) your name, postal address, email address, and telephone number, (ii) a description in reasonable detail of the nature or basis of the Dispute, and (iii) the specific relief that you are seeking. If you and AO cannot agree how to resolve the Dispute within thirty (30) days after the date notice is received by the applicable Party, then either you or AO may, as appropriate and in accordance with this Section 20, commence an arbitration proceeding or, to the extent specifically provided for in Section 20(a), file a claim in court.
										</li>
										<li>
											<b>Process.</b> Any arbitration will occur in King County, Washington. Arbitration will be conducted confidentially by a single arbitrator in accordance with the rules of the Judicial Arbitration and Mediation Services (<b>"JAMS"</b>), which are hereby incorporated by reference. The courts located in the state of Washington will have exclusive jurisdiction over any appeals and the enforcement of an arbitration award. You may also litigate a Dispute in the small claims court located in the county where you reside if the Dispute meets the requirements to be heard in small claims court.
										</li>
										<li>
											<b>Authority of Arbitrator.</b> As limited by the FAA, these Terms, and the applicable JAMS rules, the arbitrator will have (i) the exclusive authority and jurisdiction to make all procedural and substantive decisions regarding a Dispute, including the determination of whether a Dispute is arbitrable, and (ii) the authority to grant any remedy that would otherwise be available in court; provided, however, that the arbitrator does not have the authority to conduct a class arbitration or a representative action, which is prohibited by these Terms. The arbitrator may only conduct an individual arbitration and may not consolidate more than one individual's claims, preside over any type of class or representative proceeding or preside over any proceeding involving more than one individual.
										</li>
										<li>
											<b>Rules of JAMS.</b> The rules of JAMS and additional information about JAMS are available on the JAMS website. By agreeing to be bound by these Terms, you either (i) acknowledge and agree that you have read and understand the rules of JAMS, or (ii) waive your opportunity to read the rules of JAMS and any claim that the rules of JAMS are unfair or should not apply for any reason.
										</li>
									</ol>
								</li>
								<li>
									<b>Governing Law and Venue.</b> These Terms will be governed by and construed and enforced accordance with the laws of the state of Washington, without regard to conflict of law rules or principles (whether of the state of Washington or any other jurisdiction) that would cause the application of the laws of any other jurisdiction.
								</li>
								<li>
									<b>Severability.</b> If any term, clause or provision of these Terms is held unlawful, void or unenforceable, then that term, clause or provision will be severable from these Terms and will not affect the validity or enforceability of any remaining part of that term, clause or provision, or any other term, clause or provision of these Terms.
								</li>
								<li>
									<b>Disruption Event.</b> In the event of a Disruption Event, AO shall have the right to suspend the Ion Sale for up to forty-eight (48) hours. If AO elects to suspend the Ion Sale, AO will publicly announce the suspension as soon as reasonably practicable and, prior to resuming the Ion Sale, AO will announce the resumption at least four (4) hours in advance. If AO suspends the Ion Sale for a period of time (the <b>"Suspension Period"</b>) pursuant to this Section 23, AO will determine in its sole discretion whether to (i) nevertheless end the Ion Sale, or (ii) resume the Ion Sale. AO shall provide notice of its election in this regard in the public announcements of the resumption of the Ion Sale following the Suspension Period. A <b>"Disruption Event"</b> means (i) any event or occurrence that causes a disruption in the functionality of the Ethereum network or of the blockchain network underlying any of the accepted Purchase Currencies, and such disruption has a material adverse effect on the processing time for network transactions, or (ii) any event or occurrence that causes a disruption in the functionality of the smart contracts or other software used in connection with the Ion Sale and such disruption has an adverse effect on the implementation of the Ion Sale, (iii) a change in the price of any accepted Purchase Currency of twenty percent (20%) or more in any twenty four (24) hour period, or (iv) any compromise of security that has or in our sole good faith determination may have an adverse impact on the Ion Sale.
								</li>
								<li>
									<b>Ion Sale Overage.</b> It is possible that, due to technical or other factors, the total purchases during the Ion Sale may inadvertently exceed the Ion Sale Limit (as defined in Exhibit B) by minimal amounts, which in no event shall exceed 2%.
								</li>
								<li>
									<b>Miscellaneous.</b><br />
									<ol type="a">
										<li>
											Any notice required or permitted by these Terms will be deemed sufficient when Published at <a href="https://ao.network">https://ao.network</a>. If you fail to provide a valid email address, you waive your right to any notices by AO contemplated by this Agreement.
										</li>
										<li>
											AO may assign these Terms in whole, without your consent, in connection with a reincorporation to change AO's domicile, or (i) in connection with any sale of all or substantially all of AO's assets, or (ii) to any person or entity becoming the beneficial owner, directly or indirectly, of ownership interests representing more than fifty percent (50%) of the combined voting power of AO, or otherwise acquiring AO's voting control.
										</li>
										<li>
											The exhibits to these Terms are a part of, and are hereby incorporated into, these Terms. In the event of any inconsistency between these Terms and the exhibits to these Terms, the terms and conditions contained in these Terms shall control.
										</li>
										<li>
											AO shall have the right to modify these Terms by providing you written notice of such modification, if AO reasonably believes that such amendment or modification is necessary to comply with changes in applicable laws or regulations or the regulatory environment. Your continued use or holding of the Sale Ions you purchased shall constitute your acceptance of the modified terms.
										</li>
										<li>
											Neither party will be liable for any default or delay in the performance of its obligations under this Agreement, if and to the extent such default or delay is due to any cause beyond its control which could not have been reasonably foreseen and avoided by the exercise of due care and diligence consistent with the exercise of reasonable business judgment, including but not limited to: acts of God (or Satan and the Easter Bunny), fire, flood, explosion, wars, terrorism, riots, civil disturbances and strikes, or other work stoppages.
										</li>
									</ol>
								</li>
							</ol>
						</Section>
						<Section className="center">*****</Section>
						<Title>
							Exhibit A
							<Description>Creation and Allocation of Ions</Description>
						</Title>
						<Section>
							<ol>
								<li>
									AO intends to create 6 x 10<sup>15</sup> AO+ Ions.
								</li>
								<li>
									Of those, 3 x 10<sup>15</sup> will constitute the Sale Ions available for purchase in the Ion Sale.
								</li>
								<li>
									An amount of Ions equal to 50% of the Ions sold in the Ion Sale will be retained for distribution to AO Contributors (the <b>"Contributor Ions"</b>).
									<ol type="a">
										<li>
											The AO+ Ions will be presently redeemable for use on the AO Network.
										</li>
									</ol>
								</li>
								<li>
									Any Ions remaining after the distribution of the Ions sold in the Ion Sale and the allocation of the AO Ions to the AO will be destroyed.
								</li>
								<li>
									A bonus amount of AO Ions will be created in addition to the AO+ Ions relative to the position of the AO+ exchange transactions descending in order of transaction time.
								</li>
								<li>
									The AO+ multiplier is a mechanic that increases the amount of AO generated when an information transaction takes place.  When information is staked to the AO Network with AO+, the multiplier associated to that AO+ is multiplied by the inflation rate set by The AO's DAO.  For example, if a 1 mb video is stakes to the Network with AO+ that has a 10x multiplier and the inflation rate of the Network is set to 3%, then 30 Kilo AO would normally be created through inflation and distributed between the Creator and the Node(s).  However, with a 10x multiplier of staked AO+, then it would be 300 Kilo AO.
								</li>
							</ol>
						</Section>
						<Title>
							Exhibit B
							<Description>Ion Sale Pricing, Terms, and Conditions</Description>
						</Title>
						<Section>
							<ol>
								<li>
									<b>Price; Purchase Currencies</b>
									<ol type="a">
										<li>
											Ions will be priced in Main-Net Ether (<b>"ETH"</b>).
										</li>
										<li>
											The base price is [0.0000000001 ETH] Ether per Ion.
										</li>
										<li>
											The following cryptocurrencies (<b>"Purchase Currencies"</b>) can be used to purchase Ions in the Ion Sale: Ether(ETH), AO-Ether (AOETH)<br />
											<ol type="i">
												<li>
													The AO will provide the address to which payments should be sent for each Purchase Currency (the <b>"Payment Address"</b>).
												</li>
												<li>
													AO reserves the right to accept payment in other currencies on a case-by-case basis and at its sole discretion.
												</li>
											</ol>
										</li>
										<li>
											You will receive a number of Ions equal to the ETH value of the Purchase Currency you send divided by the applicable Per Ion Price.
										</li>
										<li>
											The AO+ Ion Multiplier will vary based on when you purchase Ions. The Multiplier will be reduced at a linear rate as Ions are sold ranging from 50x for the first Ion to 2x for the last Ion. In the case of bulk Ion purchases, the Multiplier for each Ion in the sale will be calculated as the average Multiplier of all Ions in the Purchase.
										</li>
									</ol>
								</li>
								<li>
									<b>Ion Sale Limit></b>
									<ol type="a">
										<li>
											The Ion Sale will be halted once 3 x 10<sup>15</sup> Ions have been sold (the <b>"Ion Sale Limit"</b>).
										</li>
									</ol>
								</li>
								<li>
									<b>Purchase; Required Information</b>
									<ol type="a">
										<li>
											In order to participate in the Ion Sale you must provide:
											<ol type="i">
												<li>
													the network address, which you own and control, from which your payment will be sent;
												</li>
												<li>
													Certification that you have read and agreed to these Terms.
												</li>
											</ol>
										</li>
									</ol>
								</li>
							</ol>
						</Section>
						<Title>
							Exhibit C
							<Description>The AO Whitepaper</Description>
						</Title>
						<Section className="center">
							The AO's Whitepaper is available at the following link: <a href="https://ao.network/assets/AO_Whitepaper.pdf" target="_blank" rel="noopener noreferrer">https://ao.network/assets/AO_Whitepaper.pdf</a>
						</Section>
						<Title>
							Exhibit D
							<Description>AO Constitution</Description>
						</Title>
						<Section className="center">
							The AO Constitution is available at the following link: <a href="https://ao.network" target="_blank" rel="noopener noreferrer">https://ao.network</a>
						</Section>
						<Title>
							Exhibit E
							<Description>AO Protocol Code</Description>
						</Title>
						<Section className="center">
							AO's Code is available at the following link: <a href="https://ao.network" target="_blank" rel="noopener noreferrer">https://ao.network</a>
						</Section>
						<Title>
							Exhibit F
							<Description>Certain Risks Relating to Purchase, Sale, and Use of Ions</Description>
						</Title>
						<Section>
							<i><b>Important Note:</b> As noted elsewhere in these Terms, the Ions are not being structured or sold as securities or any other form of investment product. Accordingly, none of the information presented in this Exhibit F is intended to form the basis for any investment decision, and no specific recommendations are intended. The AO expressly disclaims any and all responsibility for any direct or consequential loss or damage of any kind whatsoever arising directly or indirectly from: (i) reliance on any information contained in this Exhibit F, (ii) any error, omission or inaccuracy in any such information or (iii) any action resulting from such information.</i>
						</Section>
						<Section>
							<b>By purchasing, owning, and using Ions, you expressly acknowledge and assume the following risks:</b>
							<ol>
								<li>
									<b>Risk of Losing Access to Ions Due to Loss of Private Key(s), Custodial Error, or Purchaser Error</b>
									<ol type="a">
										<li>
											A private key, or a combination of private keys, is necessary to control and dispose of Ions stored in your digital wallet or vault. Accordingly, loss of requisite private key(s) associated with your digital wallet or vault storing Ions will result in loss of such Ions. Moreover, any third party that gains access to such private key(s), including by gaining access to login credentials of a hosted wallet service you use, may be able to misappropriate your Ions. Any errors or malfunctions caused by or otherwise related to the digital wallet or vault you choose to receive and store Ions, including your own failure to properly maintain or use such digital wallet or vault, may also result in the loss of you Ions. Additionally, your failure to follow precisely the procedures set forth for buying and receiving Ions, including, for instance, if you provide the wrong address for the Purchaser Address, may result in the loss of your Ions.
										</li>
									</ol>
								</li>
								<li>
									<b>Risks Associated with the Ethereum Protocol</b>
									<ol type="a">
										<li>
											Because Ions are built on the Ethereum protocol, any malfunction, breakdown, or abandonment of the Ethereum protocol may have a material adverse effect on the AO Network or Ions. Moreover, advances in cryptography, or technical advances such as the development of quantum computing, could present risks to the Ions and the AO Network, including the utility of the Ions for obtaining Services, by rendering ineffective the cryptographic consensus mechanism that underpins the Ethereum protocol.
										</li>
									</ol>
								</li>
								<li>
									<b>Risk of Mining Attacks</b>
									<ol type="a">
										<li>
											As with other decentralized cryptographic systems built on the Ethereum protocol, the Ions are susceptible to attacks by miners in the course of validating Ion transactions on the Ethereum blockchain, including, but not limited, to double-spend attacks, majority mining power attacks, and selfish-mining attacks. Any successful attacks present a risk to the Ions, including, but not limited to, accurate execution and recording of transactions involving Ions.
										</li>
									</ol>
								</li>
								<li>
									<b>Risk of Hacking and Security Weaknesses</b>
									<ol type="a">
										<li>
											Hackers or other malicious groups or organizations may attempt to interfere with the AO Network or the Ions in a variety of ways, including, but not limited to, malware attacks, denial of service attacks, consensus-based attacks, Sybil attacks, smurfing, and spoofing. Furthermore, because the AO Network is based on open-source software, there is a risk that a third party or an AO Contributor may intentionally or unintentionally introduce weaknesses into the core infrastructure of the AO Network, which could negatively affect the network and the Ions, including the utility of the Ions for obtaining Services. Hackers or other malicious groups of organizations may also attempt to get access to private keys or other access credentials in your AO Wallet or any other wallet, vault, or other storage mechanism used to receive and hold Ions.
										</li>
									</ol>
								</li>
								<li>
									<b>Risks Associated with Markets for Ions</b>
									<ol type="a">
										<li>
											The Ions are intended to be used solely within the AO Network, and AO will not support or otherwise facilitate any secondary trading or external valuation of Ions. This restricts the contemplated avenues for using Ions to the provision or receipt of Services, and could therefore create illiquidity risk with respect to the Ions you own. Even if secondary trading of Ions is facilitated by third-party exchanges, such exchanges may be relatively new and subject to little or no regulatory oversight, making them more susceptible to fraud or manipulation. Furthermore, to the extent that third parties do ascribe an external exchange value to Ions (e.g., as denominated in a digital or fiat currency), such value may be extremely volatile and diminish to zero.
										</li>
									</ol>
								</li>
								<li>
									<b>Risk of Uninsured Losses</b>
									<ol type="a">
										<li>
											Unlike bank accounts or accounts at some other financial institutions, Ions are uninsured unless you specifically obtain private insurance to insure them. Thus, in the event of loss or loss of utility value, there is no public insurer, such as the Federal Deposit Insurance Corporation, or private insurance arranged by AO, to offer recourse to you.
										</li>
									</ol>
								</li>
								<li>
									<b>Risks Associated with Uncertain Regulations and Enforcement Actions</b>
									<ol type="a">
										<li>
											The regulatory status of the Ions and distributed ledger technology is unclear or unsettled in many jurisdictions. It is difficult to predict how or whether regulatory agencies may apply existing regulation with respect to such technology and its applications, including the AO Network and the Ions. It is likewise difficult to predict how or whether legislatures or regulatory agencies may implement changes to law and regulation affecting distributed ledger technology and its applications, including the AO Network and the Ions. Regulatory actions could negatively impact the AO Network and the Ions in various ways, including, for purposes of illustration only, through a determination that the purchase, sale and delivery of the Ions constitutes unlawful activity or that the Ions are a regulated instrument that require registration or licensing of those instruments or some or all of the parties involved in the purchase, sale and delivery thereof. AO may cease operations in a jurisdiction in the event that regulatory actions, or changes to law or regulation, make it illegal to operate in such jurisdiction, or commercially undesirable to obtain the necessary regulatory approval(s) to operate in such jurisdiction.
										</li>
									</ol>
								</li>
								<li>
									<b>Risks Arising from Taxation</b>
									<ol type="a">
										<li>
											The tax characterization of Ions is uncertain. You must seek your own tax advice in connection with purchasing Ions, which may result in adverse tax consequences to you, including withholding taxes, income taxes and tax reporting requirements.
										</li>
									</ol>
								</li>
								<li>
									<b>Risk of Insufficient Interest in the AO Network or Distributed Applications</b>
									<ol type="a">
										<li>
											It is possible that the AO Network will not be used by a large number of individuals, companies, and other entities or that there will be limited public interest in the creation and development of crypto networks more generally. Such a lack of use or interest could negatively impact the development of the AO Network and therefore the potential utility of the Ions, including the utility of the Ions for obtaining Services.
										</li>
									</ol>
								</li>
								<li>
									<b>Risks Associated with the Development and Maintenance of the AO Network</b>
									<ol type="a">
										<li>
											The AO Network is still under development and may undergo significant changes over time. Although AO intends for the Ions and the AO Network to function as described in Exhibit C, and intends to take reasonable steps toward those ends, AO may have to make changes to the specifications of the Ions or AO Network for any number of legitimate reasons. Moreover, AO has no control over how other participants will use the AO Network, what products or services will be offered through the AO Network by third parties, or how third-party products and services will utilize Ions (if at all). This could create the risk that the Ions or AO Network, as further developed and maintained, may not meet your expectations at the time of purchase. Furthermore, despite AO's good faith efforts to develop and participate in the AO Network, it is still possible that the AO Network will experience malfunctions or otherwise fail to be adequately developed or maintained, which may negatively impact the AO Network and Ions, and the potential utility of the Ions, including the utility of the Ions for obtaining Services.
										</li>
									</ol>
								</li>
								<li>
									<b>Risk of an Unfavorable Fluctuation of Purchase Currencies or AO Value</b>
									<ol type="a">
										<li>
											If the value of one or more Payment Currencies or AO fluctuates unfavorably during or after the Ion Sale, the AO team may not be able to fund development, or may not be able to develop or maintain the AO Network in the manner that it intended. In addition to the usual market forces, there are several potential events which could exacerbate the risk of unfavorable fluctuation in the value of one or more Payment Currencies or AO, including another DAO-like attack on the Ethereum network, or significant security incidents or market irregularities at one or more of the major cryptocurrency exchanges.
										</li>
									</ol>
								</li>
								<li>
									<b>Risk of Dissolution of the AO or the AO Network</b>
									<ol type="a">
										<li>
											It is possible that, due to any number of reasons, including, but not limited to, an unfavorable fluctuation in the value of one or more Payment Currencies or AO (or other cryptographic and fiat currencies), decrease in the Ions' utility (including their utility for obtaining Services), the failure to gain user adoption, or intellectual property ownership challenges, the AO Network may no longer be viable to operate or the AO may dissolve.
										</li>
									</ol>
								</li>
								<li>
									<b>Risks Arising from Lack of Governance Rights </b>
									<ol type="a">
										<li>
											AO is a unincorporated Distributed Autonomous Organization which grants voting rights according to the Constitution of AO and the Code of the AO Protocol. Because Ions confer no governance rights of with respect to the AO Network or the AO, all decisions involving the AO's products or services within the AO Network or the AO itself will be made according to the Code of the AO Protocol, including, but not limited to, decisions to discontinue its products or services in the AO Network, to create and sell more Ions for use in the AO Network, or to liquidate the AO. These decisions could adversely affect the AO Network and the utility of any Ions you own, including their utility for obtaining Services.
										</li>
									</ol>
								</li>
								<li>
									<b>Operational Risks</b>
									<ol type="a">
										<li>
											The AO is a young Unincorporated Distributed Autonomous Organization and its capabilities may take longer than expected to result in the intended usefulness for the Ions. The Ions are just one product in a highly competitive market, and broad adoption by other users and developments by technology partners may take longer than expected. The usefulness of the Ions depends on the extent of widespread adoption of AO by the marketplace.
										</li>
									</ol>
								</li>
								<li>
									<b>Technology Risks</b>
									<ol type="a">
										<li>
											The Ions are intended to represent a new capability on emerging technology that is not fully proven in use. As the technology matures, new capabilities may dramatically alter the usefulness of the Ions or the ability to use or sell them. The functionality of the Ions is complex, will require enhancements and product support over time, and full functionality may take longer than expected. The full functionality of the Ions is not yet complete and no assurance can be provided of such completion.
										</li>
									</ol>
								</li>
								<li>
									<b>Risk of Internet Service Providers Disallowing, Blocking, or Modifying AO Network Information Traffic</b>
									<ol type="a">
										<li>
											Internet Service Providers have the ability to block or modify traffic between AO Nodes. Without the capacity for the AO Network to communicate, the utility of the Ions may be destroyed.
										</li>
									</ol>
								</li>
								<li>
									<b>Unanticipated Risks</b>
									<ol type="a">
										<li>
											Cryptographic Ions are a new and untested technology. In addition to the risks included in this Exhibit F there are other risks associated with your purchase, possession, and use of the Ions, including unanticipated risks. Such risks may further materialize as unanticipated variations or combinations of the risks discussed in this Exhibit F.
										</li>
									</ol>
								</li>
							</ol>
						</Section>
						<Ahref to={`/app/view/ico`}>View Ion Exchange</Ahref>
					</Wrapper>
				</section>
			</MuiThemeProvider>
		);
	}
}
