// CD Interest Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const principalInput = document.getElementById('principal');
    const interestRateInput = document.getElementById('interestRate');
    const termInput = document.getElementById('term');
    const compoundingSelect = document.getElementById('compounding');
    const additionalDepositInput = document.getElementById('additionalDeposit');
    const earlyWithdrawalCheckbox = document.getElementById('earlyWithdrawal');
    const penaltyMonthsInput = document.getElementById('penaltyMonths');
    const calculateBtn = document.getElementById('calculateBtn');
    const compareBtn = document.getElementById('compareBtn');
    const addComparisonBtn = document.getElementById('addComparisonBtn');
    const comparisonGrid = document.getElementById('comparisonGrid');

    // Term quick select buttons
    const termButtons = document.querySelectorAll('.term-btn');
    termButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const term = this.getAttribute('data-term');
            termInput.value = term;
            termButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calculateCD();
        });
    });

    // Early withdrawal checkbox
    earlyWithdrawalCheckbox.addEventListener('change', function() {
        const penaltyGroup = document.querySelector('.penalty-group');
        if (this.checked) {
            penaltyGroup.style.display = 'block';
        } else {
            penaltyGroup.style.display = 'none';
        }
        calculateCD();
    });

    // Calculate button
    calculateBtn.addEventListener('click', calculateCD);

    // Real-time calculation on input change
    principalInput.addEventListener('input', calculateCD);
    interestRateInput.addEventListener('input', calculateCD);
    termInput.addEventListener('input', calculateCD);
    compoundingSelect.addEventListener('change', calculateCD);
    additionalDepositInput.addEventListener('input', calculateCD);
    penaltyMonthsInput.addEventListener('input', calculateCD);

    // Comparison functionality
    let comparisonCount = 0;
    addComparisonBtn.addEventListener('click', addComparisonCard);
    compareBtn.addEventListener('click', function() {
        document.getElementById('comparison').scrollIntoView({ behavior: 'smooth' });
        if (comparisonCount === 0) {
            addComparisonCard();
            addComparisonCard();
        }
    });

    // Initial calculation
    calculateCD();

    // Main calculation function
    function calculateCD() {
        const principal = parseFloat(principalInput.value) || 0;
        const annualRate = parseFloat(interestRateInput.value) / 100 || 0;
        const termMonths = parseFloat(termInput.value) || 0;
        const compoundingFrequency = parseFloat(compoundingSelect.value) || 12;
        const monthlyDeposit = parseFloat(additionalDepositInput.value) || 0;
        const earlyWithdrawal = earlyWithdrawalCheckbox.checked;
        const penaltyMonths = parseFloat(penaltyMonthsInput.value) || 3;

        const termYears = termMonths / 12;

        // Calculate compound interest
        let finalBalance;
        let totalInterest;

        if (monthlyDeposit > 0) {
            // Future value of a series with compound interest
            const r = annualRate / compoundingFrequency;
            const n = compoundingFrequency * termYears;
            
            // Principal growth
            const principalGrowth = principal * Math.pow(1 + r, n);
            
            // Monthly deposits growth (converted to compounding periods)
            const depositsPerYear = 12;
            const totalDeposits = monthlyDeposit * termMonths;
            const depositsGrowth = monthlyDeposit * (Math.pow(1 + r, n) - 1) * 
                                   (compoundingFrequency / depositsPerYear) / r;
            
            finalBalance = principalGrowth + depositsGrowth;
            totalInterest = finalBalance - principal - totalDeposits;
        } else {
            // Standard compound interest formula
            const r = annualRate / compoundingFrequency;
            const n = compoundingFrequency * termYears;
            finalBalance = principal * Math.pow(1 + r, n);
            totalInterest = finalBalance - principal;
        }

        // Calculate APY (Annual Percentage Yield)
        const apy = (Math.pow(1 + annualRate / compoundingFrequency, compoundingFrequency) - 1) * 100;

        // Calculate effective rate
        const effectiveRate = (totalInterest / principal / termYears) * 100;

        // Apply early withdrawal penalty if checked
        let penaltyAmount = 0;
        if (earlyWithdrawal) {
            const monthlyInterestRate = annualRate / 12;
            penaltyAmount = principal * monthlyInterestRate * penaltyMonths;
            totalInterest = Math.max(0, totalInterest - penaltyAmount);
            finalBalance = principal + totalInterest;
        }

        // Update results display
        document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
        document.getElementById('finalBalance').textContent = formatCurrency(finalBalance);
        document.getElementById('apy').textContent = apy.toFixed(2) + '%';
        document.getElementById('effectiveRate').textContent = effectiveRate.toFixed(2) + '%';

        // Generate breakdown table
        generateBreakdownTable(principal, annualRate, termMonths, compoundingFrequency, monthlyDeposit);

        // Generate chart
        generateChart(principal, annualRate, termMonths, compoundingFrequency, monthlyDeposit);
    }

    // Generate yearly breakdown table
    function generateBreakdownTable(principal, annualRate, termMonths, compoundingFrequency, monthlyDeposit) {
        const termYears = Math.ceil(termMonths / 12);
        let tableHTML = '<table><thead><tr><th>Year</th><th>Starting Balance</th><th>Interest Earned</th><th>Deposits</th><th>Ending Balance</th></tr></thead><tbody>';

        let currentBalance = principal;
        
        for (let year = 1; year <= termYears; year++) {
            const startingBalance = currentBalance;
            const monthsInYear = Math.min(12, termMonths - (year - 1) * 12);
            const yearsElapsed = monthsInYear / 12;
            
            // Calculate interest for this period
            const r = annualRate / compoundingFrequency;
            const n = compoundingFrequency * yearsElapsed;
            
            let endingBalance;
            let deposits = monthlyDeposit * monthsInYear;
            
            if (monthlyDeposit > 0) {
                const principalGrowth = currentBalance * Math.pow(1 + r, n);
                const depositsGrowth = monthlyDeposit * (Math.pow(1 + r, n) - 1) * 
                                      (compoundingFrequency / 12) / r;
                endingBalance = principalGrowth + depositsGrowth;
            } else {
                endingBalance = currentBalance * Math.pow(1 + r, n);
                deposits = 0;
            }
            
            const interestEarned = endingBalance - startingBalance - deposits;

            tableHTML += `<tr>
                <td>Year ${year}</td>
                <td>${formatCurrency(startingBalance)}</td>
                <td>${formatCurrency(interestEarned)}</td>
                <td>${formatCurrency(deposits)}</td>
                <td>${formatCurrency(endingBalance)}</td>
            </tr>`;

            currentBalance = endingBalance;
        }

        tableHTML += '</tbody></table>';
        document.getElementById('breakdownTable').innerHTML = tableHTML;
    }

    // Generate growth chart
    function generateChart(principal, annualRate, termMonths, compoundingFrequency, monthlyDeposit) {
        const canvas = document.getElementById('growthChart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;

        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const graphWidth = width - padding * 2;
        const graphHeight = height - padding * 2;

        // Generate data points
        const dataPoints = [];
        const principalPoints = [];
        const months = Math.min(termMonths, 60); // Limit to 60 months for chart
        const interval = Math.max(1, Math.floor(months / 20)); // Show up to 20 points

        for (let month = 0; month <= months; month += interval) {
            const years = month / 12;
            const r = annualRate / compoundingFrequency;
            const n = compoundingFrequency * years;
            
            let balance;
            if (monthlyDeposit > 0 && month > 0) {
                const principalGrowth = principal * Math.pow(1 + r, n);
                const depositsGrowth = monthlyDeposit * (Math.pow(1 + r, n) - 1) * 
                                      (compoundingFrequency / 12) / r;
                balance = principalGrowth + depositsGrowth;
            } else {
                balance = principal * Math.pow(1 + r, n);
            }
            
            dataPoints.push({ month, balance });
            principalPoints.push({ month, balance: principal + (monthlyDeposit * month) });
        }

        // Find max value for scaling
        const maxBalance = Math.max(...dataPoints.map(p => p.balance));
        const maxMonth = months;

        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw grid lines
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (graphHeight * i / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw principal line (deposits only)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        principalPoints.forEach((point, index) => {
            const x = padding + (point.month / maxMonth) * graphWidth;
            const y = height - padding - (point.balance / maxBalance) * graphHeight;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw balance line (with interest)
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        dataPoints.forEach((point, index) => {
            const x = padding + (point.month / maxMonth) * graphWidth;
            const y = height - padding - (point.balance / maxBalance) * graphHeight;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points
        dataPoints.forEach(point => {
            const x = padding + (point.month / maxMonth) * graphWidth;
            const y = height - padding - (point.balance / maxBalance) * graphHeight;
            ctx.fillStyle = '#2563eb';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        // X-axis labels (months)
        for (let i = 0; i <= 4; i++) {
            const month = (maxMonth * i / 4);
            const x = padding + (graphWidth * i / 4);
            ctx.fillText(Math.round(month) + 'mo', x, height - padding + 20);
        }

        // Y-axis labels (balance)
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = maxBalance * (5 - i) / 5;
            const y = padding + (graphHeight * i / 5);
            ctx.fillText('$' + formatNumber(value), padding - 10, y + 4);
        }

        // Legend
        ctx.textAlign = 'left';
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(padding + 10, 10, 20, 3);
        ctx.fillStyle = '#1f2937';
        ctx.fillText('Total Balance', padding + 35, 15);
        
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(padding + 150, 10, 20, 3);
        ctx.fillStyle = '#1f2937';
        ctx.fillText('Principal Only', padding + 175, 15);
    }

    // Comparison card functionality
    function addComparisonCard() {
        comparisonCount++;
        const cardId = 'comparison-' + comparisonCount;
        
        const cardHTML = `
            <div class="comparison-card" id="${cardId}">
                <button class="close-btn" onclick="removeComparisonCard('${cardId}')">×</button>
                <h4>CD Option ${comparisonCount}</h4>
                <div class="input-group">
                    <label>Amount ($)</label>
                    <input type="number" class="comp-principal" value="10000" min="0">
                </div>
                <div class="input-group">
                    <label>APR (%)</label>
                    <input type="number" class="comp-rate" value="4.5" min="0" max="20" step="0.01">
                </div>
                <div class="input-group">
                    <label>Term (Months)</label>
                    <input type="number" class="comp-term" value="12" min="1">
                </div>
                <div class="input-group">
                    <label>Compounding</label>
                    <select class="comp-compound">
                        <option value="365">Daily</option>
                        <option value="12" selected>Monthly</option>
                        <option value="4">Quarterly</option>
                        <option value="1">Annually</option>
                    </select>
                </div>
                <div class="result">
                    <strong>Total Interest:</strong> <span class="comp-interest">$450.00</span><br>
                    <strong>Final Balance:</strong> <span class="comp-balance">$10,450.00</span><br>
                    <strong>APY:</strong> <span class="comp-apy">4.59%</span>
                </div>
            </div>
        `;
        
        comparisonGrid.insertAdjacentHTML('beforeend', cardHTML);
        
        // Add event listeners to new card
        const card = document.getElementById(cardId);
        const inputs = card.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => calculateComparison(cardId));
        });
        
        calculateComparison(cardId);
    }

    // Make removeComparisonCard globally accessible
    window.removeComparisonCard = function(cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.remove();
            comparisonCount--;
        }
    };

    function calculateComparison(cardId) {
        const card = document.getElementById(cardId);
        const principal = parseFloat(card.querySelector('.comp-principal').value) || 0;
        const annualRate = parseFloat(card.querySelector('.comp-rate').value) / 100 || 0;
        const termMonths = parseFloat(card.querySelector('.comp-term').value) || 0;
        const compoundingFrequency = parseFloat(card.querySelector('.comp-compound').value) || 12;

        const termYears = termMonths / 12;
        const r = annualRate / compoundingFrequency;
        const n = compoundingFrequency * termYears;
        
        const finalBalance = principal * Math.pow(1 + r, n);
        const totalInterest = finalBalance - principal;
        const apy = (Math.pow(1 + annualRate / compoundingFrequency, compoundingFrequency) - 1) * 100;

        card.querySelector('.comp-interest').textContent = formatCurrency(totalInterest);
        card.querySelector('.comp-balance').textContent = formatCurrency(finalBalance);
        card.querySelector('.comp-apy').textContent = apy.toFixed(2) + '%';
    }

    // Utility functions
    function formatCurrency(value) {
        return '$' + value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function formatNumber(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return value.toFixed(0);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

