
class BudgetMath {

    static getTotal(arr, className) {
        let total = 0
        let tableArr = arr.rows


        for (let i = 0; i < tableArr.length; i++) {
            let cellVal = parseFloat(tableArr[i].cells[1].innerText)
            total += cellVal

        }


        let grandTotal = document.querySelector(className)
        grandTotal.innerText = total
    }

    static budgetTotal() {
        let totalSpot = document.getElementById("total-budget")
        let inc = parseFloat(document.querySelector('.inc-val').innerText)

        if (isNaN(inc)) {
            inc = 0
        }

        let exp = parseFloat(document.querySelector('.exp-val').innerText)

        if (isNaN(exp)) {
            exp = 0
        }

        let budget = inc - exp
        totalSpot.innerText = budget

        if (inc > exp || inc === 0 || exp === 0) {
            totalSpot.parentElement.setAttribute('class', 'budget-green')
        } else {
            totalSpot.parentElement.setAttribute('class', 'budget-red')
        }
    }


}
