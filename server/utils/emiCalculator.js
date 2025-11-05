function calculateEMI(principal, tenure, interestRate) {
  const principalNum = parseFloat(principal) || 0;
  const tenureNum = parseInt(tenure) || 0;
  const interestRateNum = parseFloat(interestRate) || 0;

  if (tenureNum === 0) {
    return 0;
  }

  if (interestRateNum === 0) {
    return principalNum / tenureNum;
  }

  const monthlyRate = interestRateNum / 100 / 12;
  const emi = (principalNum * monthlyRate * Math.pow(1 + monthlyRate, tenureNum)) /
              (Math.pow(1 + monthlyRate, tenureNum) - 1);
  return emi;
}

module.exports = {
  calculateEMI,
};

