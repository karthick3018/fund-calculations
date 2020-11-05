import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Select from '../../common/atoms/select';
import Input from '../../common/atoms/input';
import { formatNumberWithCommas } from '../../common/helpers';
import ReactSlider from "react-slider";
import style from './style.css';
import Calc from '../../assets/icons/calc.svg';


const Home = () => {
	const [fundOptions, setFundOptions] = useState([]);
	const [selectedFund, setSelectedFund] = useState({});
	const [state, setState] = useState({
		amount: 10000,
		stepUp: 10,
		duration: 5,
		returns: 11.25,
		currentTab: 1, // if 1 then its sip
		calculatedTotalInvestment: 0,
		calculatedWealthGained: 0,
		calculatedFinalValue: 0,
	})

	useEffect(() => {
		getOptionsValues();
	}, [])

	useEffect(() => {
		const result = sipComputationWithStepup(
			state.amount,
			state.returns,
			state.duration,
			state.stepUp,
			state.currentTab === 1
		);

		if (state.currentTab !== 1) {
			// we are in target amount
			setState({
				...state,
				calculatedTotalInvestment: result[0] ? Math.ceil(result[0]) : 0,
				calculatedWealthGained: result[1] ? Math.ceil(result[1]) : 0,
				calculatedFinalValue: result[2] ? Math.ceil(result[2]) : 0,
			});
		} else {
			// we are in sip
			setState({
				...state,
				calculatedTotalInvestment: result[0] ? Math.ceil(result[0]) : 0,
				calculatedWealthGained: result[1] ? Math.ceil(result[1]) : 0,
				calculatedFinalValue: result[2] ? Math.ceil(result[2]) : 0,
			});
		}
	}, [
		state.amount,
		state.stepUp,
		state.duration,
		state.returns,
		state.currentTab,
	]);

	useEffect(() => {
    setState({
      ...state,
      returns: parseFloat(selectedFund?.returnValue),
    });
  }, [selectedFund]);

	const stepUpOptions = [
		{
			name: '0 %',
			value: 0,
		},
		{
			name: '10 %',
			value: 10
		},
		{
			name: '15 %',
			value: 15
		},
		{
			name: '20 %',
			value: 20
		},
		{
			name: '25 %',
			value: 25
		},
		{
			name: '30 %',
			value: 30
		}
	]

	const getOptionsValues = () => {
		fetch('https://apus.scripbox.com/api/v1/search', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				q: "hdfc",
				from: 0,
				size: 10,
			})
		})
			.then(res => res.json())
			.then(
				(data) => {
					let result = [];
					data?.results?.map(eachData => {
						result.push({
							name: eachData?._source?.fund_name,
							value: eachData?._source?.fund_name,
							returnValue:
								eachData?._source?.asset_class === "Debt"
									? eachData?._source?.return3y
									: eachData?._source?.return5y,
							slug: eachData?._source?.slug,
						})
					})
					setFundOptions(result);
					setSelectedFund(result?.[0])
					return result
				},
				(error) => {
					console.log(error)
				}
			)
	}

	const handleAmountChange = (e) => {
		setState({
			...state,
			amount: e.target.value
		})
	}

	const handleStepUpChange = (value) => {
		setState({ ...state, stepUp: parseFloat(value) })
	}

	function sipComputationWithStepup(
		investments,
		rate,
		tenure,
		stepup_percentage,
		isSip
	) {
		//with sip stepup percentage
		let totalEarnings, totalInvestment, monthlyInvestments, futureValue, result;
		let rate_per_month = parseFloat(rate) / (12 * 100);
		let no_investment_months = parseInt(tenure) * 12;
		stepup_percentage = stepup_percentage || 10;
		stepup_percentage = stepup_percentage / 100;
		let T1 = Math.pow(1 + rate_per_month, 12);
		let T2 = (1 + stepup_percentage) * Math.pow(1 + rate_per_month, -12);
		let T3 = (T1 - 1) / rate_per_month / (T2 - 1);
		let T4 =
			T3 *
			Math.pow(1 + rate_per_month, no_investment_months - 11) *
			(Math.pow(T2, no_investment_months / 12) - 1);
		if (!isSip) {
			futureValue = investments;
			monthlyInvestments = futureValue / T4;
			if (stepup_percentage) {
				let sipAmount = monthlyInvestments;
				for (let i = 0; i < tenure; i++) {
					totalInvestment =
						parseInt(totalInvestment ? totalInvestment : 0) +
						parseInt(sipAmount * 12);
					sipAmount =
						parseInt(sipAmount) + parseInt(sipAmount * stepup_percentage);
				}
			} else {
				totalInvestment = no_investment_months * monthlyInvestments;
			}
			totalEarnings = futureValue - totalInvestment;
			result = [investments, totalEarnings, monthlyInvestments];
		} else if (isSip) {
			monthlyInvestments = investments;
			futureValue = monthlyInvestments * T4;
			if (stepup_percentage) {
				let sipAmount = monthlyInvestments;
				for (let j = 0; j < tenure; j++) {
					totalInvestment =
						parseInt(totalInvestment ? totalInvestment : 0) +
						parseInt(sipAmount * 12);
					sipAmount =
						parseInt(sipAmount) + parseInt(sipAmount * stepup_percentage);
				}
			} else {
				totalInvestment = no_investment_months * monthlyInvestments;
			}
			totalEarnings = futureValue - totalInvestment;
			result = [totalInvestment, totalEarnings, futureValue, monthlyInvestments];
		}
		return result;
	}

	const handleOptionChange = (value, restValues) => {
    setSelectedFund(restValues)
	}

	return (
	 	 <div className="w-350 h-md bg-white shadow-calculator rounded-md mx-auto mt-5">
			<div className="px-4 pt-2">
					<div className="flex items-center"> 
					<figure className="flex justify-center items-center m-0 p-0">
						<img src={Calc} alt="calculator icon" /> 
					</figure>
					<h1 className="h-5 font-medium text-base leading-5 pl-3 text-595959 not-italic font-inter">Investment Calculator</h1>
					</div>

					<div className="pt-6 pb-4 auto-cols-auto text-sm">
						<div className="flex justify-between bg-light-grey rounded py-0.31 px-2  font-inter">
							<div className="w-6/12 text-center bg-white rounded py-1">
								Monthly SIP
							</div>
							<div  className="w-6/12 text-center py-1">
								Target Amount
							</div>
						</div>
					</div>

					<div className=" py-3">
						<label className="pb-2 font-small text-sm leading-4 flex items-center text-595959 not-italic font-inter">Fund Name</label>
						<div className="flex flex-col p-0 static bg-white rounded-md flex-none order-none self-stretch flex-grow-0 m-0">
						 <Select options={fundOptions} placeholder={"Choose your fund"} isSearch={true} handleOptionChange={handleOptionChange} value={selectedFund?.value} />
						</div>
					</div>

					<div className="flex">
						<div className="w-full max-w-full pr-3">
							<label className="w-52 h-4 font-small text-sm leading-4 flex items-center text-595959 not-italic font-inter pb-2">Amount</label>
							<Input className="w-205 h-8 shadow-input rounded-md py-1 px-2" type="number" value={state?.amount} onChange={handleAmountChange} />
						</div>
						<div className="w-full">
							<label className="font-small text-sm leading-4  flex items-center text-595959 not-italic font-inter pb-2">Step-up</label>
							<Select  options={stepUpOptions} placeholder={'Choose step up'} value={state?.stepUp} handleOptionChange={handleStepUpChange} />
						</div>
					</div>	

				<div className="py-6 ">
					<p className="font-small text-sm leading-4 flex items-center text-595959 not-italic font-inter pb-2">Investment Duration <span className="text-4E93EE ml-1"> {state?.duration} years</span></p>
						<div className="pt-4" style={{ position: "relative" }}>
							<ReactSlider
								min={0}
								renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
								renderTrack={(props, state) => <div className={style.normal} {...props}>{state.valueNow}</div>}
								defaultValue={[5]}
								step={1}
								onChange={val => setState({ ...state, duration: val })}
								className={style.horizontalSlider}
								trackClassName={`${style.track} ${style.active}`}
								thumbClassName={style.thumb}
								max={30} />
						</div>
					</div>	

				<div className="flex justify-between items-center px-6">
					<div>
						<p className="text-lg leading-5 text-181818 pb-2">{formatNumberWithCommas(state.calculatedTotalInvestment)}</p>
						<span className="pt-2 text-sm text-737373">Total Investment</span>
					</div>
					<div>
						<p className="text-lg leading-5 text-181818 pb-2">{formatNumberWithCommas(state.calculatedWealthGained)}</p>
						<span className="pt-2 text-sm text-737373">Wealth Gained</span>
					</div>
				</div>
				
					<div className="mt-4 mb-2 p-5 rounded-lg text-center bg-grey">
						<p className="font-bold text-2xl text-0FAC85"> {state.calculatedFinalValue >= 0 ? formatNumberWithCommas(state.calculatedFinalValue): 0}</p>
						<p className="text-04040 text-sm">Total Corpus Created (₹)</p>
						<small className="text-xs text-737373">With assumed returns of {state?.returns} %</small>
					</div>

				<div className="outline-none ">
					<a className="w-full bg-green rounded-md text-center border-none text-sm inline-block text-white pt-3 pb-4 font-semibold" href="https://scripbox.com/mutual-fund/hdfc-index-fund-nifty-50-plan-growth-plan">See Scripbox Opinion for this fund</a>
				</div>

			</div>		
		</div>	

	)
}

export default Home;
