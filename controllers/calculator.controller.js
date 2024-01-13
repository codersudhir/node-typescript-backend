const ApiError = require('../errors/ApiError')

class CalculatorController {

    calSimpleInterest = async (req, res, next) => {
        // let {principle, rate, year} =parseInt(req.body)

        let principle =parseInt(req.body.principle)
        let rate =parseInt(req.body.rate)
        let year =parseInt(req.body.year)
       
       


        let interest = (principle * rate * year) / 100

        let yearlyCalculation = []
        let monthlyCalculation = []

        let interestPerYer = principle * (rate / 100)

        let totalPrinciple = principle
        for (let i = 0; i < year * 12; i++) {
            if ((i + 1) % 12 === 0) {
                yearlyCalculation.push({
                    "year": (i + 1) / 12,
                    "opening_balance": Math.round(principle),
                    "interest_earned": Math.round(interestPerYer),
                    "closing_balance": Math.round(principle = principle + interestPerYer)
                })
            }
            monthlyCalculation.push({
                "month": i + 1,
                "opening_balance": Math.round(totalPrinciple),
                "interest_earned": Math.round(interestPerYer / 12),
                "closing_balance": Math.round(totalPrinciple += (interestPerYer / 12))
            })
        }

        return res.status(200).json({
            status: "success",
            principle: principle,
            interestEarned: Math.round(interest),
            yearlyCalculation: yearlyCalculation,
            monthlyCalculation: monthlyCalculation
        })
    }

    calCompoundInterest = async (req, res, next) => {
        // let {principle, rate, year, compoundFreqInYear} = req.body

        let principle =parseInt(req.body.principle)
        let rate =parseInt(req.body.rate)
        let year =parseInt(req.body.year)
        let compoundFreqInYear =parseInt(req.body.compoundFreqInYear)
        let interestEarned = 0

        let {
            yearlyCalculation,
            monthlyCalculation
        } = calculateYearWiseInterestCompounded(principle, rate, year, req.body.compoundFreqInYear)


        rate = rate / 100
        let multiplier = (1 + (rate / compoundFreqInYear)) ** (year * compoundFreqInYear)
        let total = principle * multiplier
        interestEarned = total - principle

        return res.status(200).json({
            status: "success",
            principle: principle,
            interestEarned: Math.round(interestEarned),
            yearWiseInterest: yearlyCalculation,
            monthlyCalculation: monthlyCalculation
        })
    }

    calSIPGain = async (req, res, next) => {
        let {monthlyInvestment, rate, year} = req.body
        rate = rate / (100 * 12)
        let invested = monthlyInvestment * year * 12
        let yearlyGain = []

        let multiplier = ((1 + rate) ** (year * 12) - 1) / rate
        let futureValue = monthlyInvestment * multiplier * (1 + rate)

        let gains = futureValue - invested

        let thisYearInterest = 0
        for (let i = 0; i < year; i++) {
            let previousYearInterest = thisYearInterest

            let multiplier = ((1 + rate) ** ((i + 1) * 12) - 1) / rate
            let thisYearGain = monthlyInvestment * multiplier * (1 + rate);
            thisYearInterest = thisYearGain - (monthlyInvestment * 12 * (i + 1))

            yearlyGain.push({
                "year": i + 1,
                "investment_amount": monthlyInvestment * 12,
                "interest_earned": Math.round(thisYearInterest - previousYearInterest),
                "maturity_amount": Math.round(thisYearGain)
            })
        }

        return res.status(200).json({
            status: "success",
            total: Math.round(futureValue),
            invested: invested,
            gain: Math.round(gains),
            yearlyCalculation: yearlyGain
        })
    }

    calNPSGain = async (req, res, next) => {
        let {monthlyInvestment, rate, currentAge} = req.body
        rate = rate / (100 * 12)
        let year = 60 - currentAge
        let invested = monthlyInvestment * year * 12
        let yearlyGain = []


        let multiplier = ((1 + rate) ** (year * 12) - 1) / rate
        let futureValue = monthlyInvestment * multiplier * (1 + rate)

        let gains = futureValue - invested

        let thisYearInterest = 0
        for (let i = 0; i < year; i++) {
            let previousYearInterest = thisYearInterest

            let multiplier = ((1 + rate) ** ((i + 1) * 12) - 1) / rate
            let thisYearGain = monthlyInvestment * multiplier * (1 + rate);
            thisYearInterest = thisYearGain - (monthlyInvestment * 12 * (i + 1))

            yearlyGain.push({
                "year": i + 1,
                "investment_amount": monthlyInvestment * 12,
                "interest_earned": Math.round(thisYearInterest - previousYearInterest),
                "maturity_amount": Math.round(thisYearGain)
            })
        }

        return res.status(200).json({
            status: "success",
            total: Math.round(futureValue),
            invested: invested,
            gain: Math.round(gains),
            yearlyGain: yearlyGain
        })
    }

    calLumpSumGain = async (req, res, next) => {
        let {invested, rate, year} = req.body

        let amount = invested * (1 + (rate / 100)) ** year

        let {
            yearlyCalculation,
            monthlyCalculation
        } = calculateYearWiseInterestCompounded(invested, rate, year, 1)

        return res.status(200).json({
            status: "success",
            total: Math.round(amount),
            invested: invested,
            gain: Math.round(amount - invested),
            yearlyCalculation: yearlyCalculation,
            monthlyCalculation: monthlyCalculation
        })
    }

    emi = async (req, res, next) => {
        // let {loanAmount, loanTenure, rate} = req.body
        // rate = rate / 12 / 100

        // loanTenure = loanTenure * 12

        // let emi = loanAmount * rate * ((1 + rate) ** loanTenure) / (((1 + rate) ** loanTenure) - 1)

        // let totalAmount = emi * loanTenure

        // let monthlyPayment = calculateMonthlyEmiPayment(loanAmount, req.body.rate, req.body.loanTenure, emi)

        // return res.status(200).json({
        //     status: "success",
        //     emi: Math.round(emi),
        //     loanAmount: loanAmount,
        //     totalInterest: Math.round(totalAmount - loanAmount),
        //     totalAmount: Math.round(totalAmount),
        //     monthlyPayment: monthlyPayment
        // })

        const P0 = req.body.loanAmount;
        const ir = req.body.interestRate;
        const N = req.body.term;
      
        if (P0 > 0 && N > 0 && ir > 0) {
            var payments = Array.from({ length: N + 1 });
            var r = ir / 100 / 12;
    
            var c = (P0 * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
            var total = c * N;
    
            var remainingPrincipal = P0;
    
           
    
            payments[0] = {
              index: 0,
              amount: 0,
              principal: 0,
              interest: 0,
              remainingAmount: total
            };
        }
    
        for (var i = 1; i <= N; i++) {
            var interest = remainingPrincipal * r;
    
            payments[i] = {
              index: i,
              amount: c,
              principal: c - interest,
              interest: interest,
              remainingAmount: total - c * i
            };
            remainingPrincipal -= c - interest;
          }
        res.json({ payments, total, c, interest: total - P0 });
        
    }

    homeLoanEligibility = async (req, res, next) => {

    }

    CAGR = async (req, res, next) => {
        let {totalInvestment, matuarityValue, years} = req.body
        let cagr = (matuarityValue / totalInvestment) ** (1 / years) - 1
        return res.status(200).json({
            status: "success",
            cagr: `${(cagr * 100).toFixed(2)}%`
        })

    }


    calFDReturn = async (req, res, next) => {
        let {type, principle, rate, year} = req.body
        let interestEarned = 0
        let yearlyCalculation = undefined
        let monthlyCalculation = undefined


        if (type === "simple") {
            interestEarned = (principle * rate * year) / 100
        } else {
            yearlyCalculation, monthlyCalculation = calculateYearWiseInterestCompounded(principle, rate, year, req.body.compoundFreqInYear)
            rate = rate / 100
            let multiplier = (1 + (rate / req.body.compoundFreqInYear)) ** (year * req.body.compoundFreqInYear)
            let total = principle * multiplier
            interestEarned = total - principle
        }

        return res.status(200).json({
            status: "success",
            principle: principle,
            interestEarned: Math.round(interestEarned),
            yearWiseInterest: yearlyCalculation,
            monthlyCalculation: monthlyCalculation
        })
    }


    calRDReturn = async (req, res, next) => {
        let {principle, rate, months} = req.body

        let sum = 0
        rate = rate / 100

        for (let i = 1; i <= months; i++) {
            sum = sum + (principle * ((1 + (rate / 4)) ** (4 * (i / months))))
        }

        return res.status(200).json({
            status: "success",
            invested: Math.round(principle * months),
            interestEarned: Math.round(sum - (principle * months)),
            amount: Math.round(sum)
        })
    }

    calcHra = async (req, res, next) => {
        let {basic, hra, rentPaid, allowances, metroCity} = req.body

        let hraSanctionedYearly = hra * 12
        let rentPaidYearly = rentPaid * 12
        let hraCalculation = rentPaidYearly - (basic * 12 * 0.10)

        let metroExemption = 0
        if (metroCity) {
            metroExemption = basic * 12 * 0.5
        } else {
            metroExemption = basic * 12 * 0.4
        }

        let hraExempted = 0
        if (hraCalculation < metroExemption) {
            if (hraCalculation < hraSanctionedYearly)
                hraExempted = hraCalculation
            else
                hraExempted = hraSanctionedYearly
        } else {
            if (metroExemption < hraSanctionedYearly)
                hraExempted = metroExemption
            else
                hraExempted = hraSanctionedYearly
        }

        return res.status(200).json({
            status: "success",
            hraExempted: hraExempted
        })
    }

    depreciation = async (req, res, next) => {
        let {purchasePrice, scrapValue, estimatedUsefulLife} = req.body
        let residualRate = 1 - ((scrapValue / purchasePrice) ** (1 / estimatedUsefulLife))

        return res.status(200).json({
            status: "success",
            depreciationPercentage: `${(residualRate * 100).toFixed(2)}%`,
            costOfAsset: purchasePrice
        })
    }

    epf = async (req, res, next) => {
        let {basicSalary, allowances, currentAge, increaseInSalaryPercentage} = req.body


        return res.status(200).json({
            status: "success",
            depreciationPercentage: `${(residualRate * 100).toFixed(2)}%`,
            costOfAsset: purchasePrice
        })
    }


    mis = async (req, res, next) => {
        let {investmentAmount, interestRate} = req.body
        let monthlyIncome = investmentAmount * (interestRate / 1200)

        return res.status(200).json({
            status: "success",
            monthlyIncome: monthlyIncome
        })
    }

    capitalGain = async (req, res, next) => {
        let {assets, buyDate, sellDate, buyPrice, sellPrice} = req.body
        let boughtDate = new Date(buyDate)
        let soldDate = new Date(sellDate)
        let profit = sellPrice - buyPrice
        let taxAmount = 0
        let taxRate = 0

        if (profit <= 0)
            return res.status(200).json({
                status: "success",
                message: "You have book a capital losses."
            })

        let differenceInTime = soldDate.getTime() - boughtDate.getTime()
        let differenceInDays = differenceInTime / (1000 * 3600 * 24)

        switch (assets) {
            case "stocks": {
                if (differenceInDays > 365) taxRate = 10
                else taxRate = 15
                break;
            }
            case "equityMutualFunds": {
                if (differenceInDays > 365) taxRate = 10
                else taxRate = 15
                break;
            }
            case "mutualFunds": {
                if (differenceInDays > 1095) taxRate = 10
                else taxRate = 0
                break;
            }
            case "bonds": {
                if (differenceInDays > 1095) taxRate = 10
                else taxRate = 0
                break;
            }
            case "gold": {
                if (differenceInDays > 1095) taxRate = 10
                else taxRate = 0
                break;
            }
            case "property": {
                if (differenceInDays > 1095) taxRate = 10
                else taxRate = 0
                break;
            }
            default: {
                return next(ApiError.badRequest("Invalid assets"))
            }
        }


        if (taxRate === 0)
            return res.status(200).json({
                status: "success",
                profit: profit,
                effective_tax_rate: `For tax computation, Your Gain of ₹${profit} will be added in your total income and tax will be applicable at effective tax rate`
            })

        taxAmount = profit * (taxRate / 100)
        return res.status(200).json({
            status: "success",
            profit: profit,
            tax_amount: taxAmount.toFixed(2),
            effective_tax_rate: `${taxRate}%`
        })
    }

    gstCalculator = async (req, res, next) => {
        let {amount, gstRate, type} = req.body

        let finalAmount = 0
        let gstAmount = 0

        if (type === "excluding") {
            gstAmount = amount * gstRate / 100

            finalAmount = amount + gstAmount
        } else if (type === "including") {
            finalAmount = amount
            amount = amount / (1 + (gstRate / 100))
            gstAmount = finalAmount - amount
        } else {
            return next(ApiError.badRequest("type parameter missing"))
        }

        return res.status(200).json({
            status: "success",
            finalAmount: finalAmount.toFixed(2),
            gstAmount: gstAmount.toFixed(2),
            sgst:(gstAmount/2).toFixed(2),
            cgst:(gstAmount/2).toFixed(2),
            amount: amount.toFixed(2),
            gstType: type,
            gstRate: `${gstRate}%`
        })
    }
}


calculateYearWiseInterestCompounded = (principle, rate, years, compoundFreqInYear) => {
    let yearlyCalculation = []
    let monthlyCalculation = []

    rate = rate / 100
    rate = rate / compoundFreqInYear

    // for (let i = 0; i < years; i++) {
    //     for (let j = 0; j < compoundFreqInYear; j++) {
    //         let interest = principle * rate
    //
    //         if (j === compoundFreqInYear - 1) {
    //             yearlyCalculation.push({
    //                 "year": (i + 1),
    //                 "opening_balance": Math.round(principle),
    //                 "interest_earned": Math.round(interest),
    //                 "closing_balance": Math.round(principle = principle + interest)
    //             })
    //         } else {
    //             principle = principle + interest
    //         }
    //     }
    // }

    let monthlyPrinciple = principle
    // let monthlyInterest = interest / 12
    for (let k = 0; k < years * 12; k++) {

        let monthlyInterest = (principle * rate) / (12 / compoundFreqInYear)

        let totalInterest = 0
        if ((k + 1) % 12 === 0) {
            let i = (k + 1) / 12

            totalInterest = 0
            for (let j = 0; j < compoundFreqInYear; j++) {

                let interest = (principle + totalInterest) * rate
                totalInterest += interest
                // principle = principle + interest

                if (j === compoundFreqInYear - 1) {
                    yearlyCalculation.push({
                        "year": i,
                        "opening_balance": Math.round(principle),
                        "interest_earned": Math.round(totalInterest),
                        "closing_balance": Math.round(principle = principle + totalInterest)
                    })
                }
            }
        }
        monthlyCalculation.push({
            "month": (k + 1),
            "opening_balance": Math.round(monthlyPrinciple),
            "interest_earned": Math.round(monthlyInterest),
            "closing_balance": Math.round(monthlyPrinciple = monthlyPrinciple + monthlyInterest)
        })
    }

    return {yearlyCalculation, monthlyCalculation}
}

calculateMonthlyEmiPayment = (loanAmount, rate, loanTenure, emi) => {
    let monthlyCalculation = []
    let totalLoanAmount = loanAmount

    for (let i = 0; i < loanTenure * 12; i++) {
        let towardsInterest = totalLoanAmount * rate / (100 * 12)
        let towardsLoan = emi - towardsInterest
        totalLoanAmount = totalLoanAmount - towardsLoan
        monthlyCalculation.push({
            "month": i + 1,
            "emi": Math.round(emi),
            "towards_loan": Math.round(emi - towardsInterest),
            "towards_interest": Math.round(towardsInterest),
            "outstanding_loan": Math.round(totalLoanAmount)
        })
    }

    return monthlyCalculation
}

// calculateMonthWiseInterestCompounded = (principle, rate, years, compoundFreqInYear) => {
//     let monthlyCalculation = []
//
//     rate = rate / 100
//     rate = rate / compoundFreqInYear
//
//     for (let i = 0; i < years * 12; i++) {
//
//         monthlyCalculation.push({
//             "month": (i + 1),
//             "opening_balance": Math.round(principle),
//             "interest_earned": Math.round(interest),
//             "closing_balance": Math.round(principle = principle + interest)
//         })
//     }
//     return monthlyCalculation
// }


module.exports = new CalculatorController()