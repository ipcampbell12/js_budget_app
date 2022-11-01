// Features
// add income/expesnses x
// budget is automatically updated x
// expense total is updated x
// income total is updated x
// shows commas for numbers 
// can remove items from list x
// percentage of total expenses/income is updated x
// change parseints to pareflaots 
// styling 
// figure out alerts

class BudgetItem {
  constructor(value, desc, type, id, perc) {
    this.value = value;
    this.desc = desc;
    this.type = type;
    this.id = id;
    this.perc = perc;

  }
}


class UI {

  static displayItems() {
    const items = Store.getBudgetItems()

    items.forEach((item) => UI.addItemToList(item));

  }

  static displayNums() {
    const numberFormatter =
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      });

    const inc = document.querySelector('.inc-val')
    let incVal = numberFormatter.format(Store.getNums()[0])
    inc.innerText = incVal

    const exp = document.querySelector('.exp-val')
    let expVal = numberFormatter.format(Store.getNums()[1])
    exp.innerText = expVal

    const over = document.getElementById('total-budget')
    let overVal = numberFormatter.format(Store.getNums()[2])
    over.innerText = overVal

    const perc = document.getElementById('exp-percent')
    perc.innerText = Store.getNums()[3]

  }




  static displayPerces() {
    const items = Store.getBudgetItems()

    //console.log(items)
    const itemList = document.getElementById('expenses-list').children

    //console.log(itemList)

    for (let item of itemList) {
      const itemId = Number(item.cells[0].innerHTML)
      //console.log(itemId)
      const storePerc = items.find(item => item.id === itemId).perc
      item.cells[3].innerHTML = storePerc

    }

    //itemList.map(id => items.find(x => x.id === id))

  }



  static addItemToList(item) {

    const numberFormatter =
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      });

    //INCOME
    if (item.type === 'inc') {

      let incArr = document.getElementById('income-list');
      const newRow = document.createElement('tr');
      newRow.setAttribute('class', 'table-success')
      // const id = Store.setId(item)


      newRow.innerHTML = `

       <td style="display:none">${item.id}</td>
       <td>${item.desc}</td>
       <td>${numberFormatter.format(item.value)}</td>
       <td id="${item.id}"> <a href="#" class="delete btn btn-danger"> X </a> </td>
    `

      incArr.appendChild(newRow)



      //EXPENSES
    } else if (item.type === 'exp') {

      let expArr = document.getElementById('expenses-list');
      const newRow = document.createElement('tr');
      newRow.setAttribute('class', 'table-danger')

      newRow.innerHTML = `

       <td style="display:none">${item.id}</td>
       <td>${item.desc}</td>
       <td>${numberFormatter.format(item.value)}</td>
       <td class = "percentage bg-info p-2 text-dark bg-opacity-25"> ${item.perc} </td>
       <td id="${item.id}"> <a href="#" class="delete btn btn-danger"> X </a> </td>
    `
      expArr.appendChild(newRow)
    }



  }

  static deleteBudgetItem(el) {
    //remove if delete button pressed
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove()
    }

  }


  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const bottom = document.querySelector('.bottom');
    const container = document.querySelector('.container');
    bottom.insertBefore(div, container);

    setTimeout(() => document.querySelector('.alert').remove(), 3000)
  }

  static clearFields() {
    //console.log("This function is run")
    document.querySelector('.add__value').value = '';
    document.querySelector('.add__description').value = '';

  }

}




// Store Class: Handles storage (local storage)

class Store {


  static getBudgetItems() {
    let items;
    if (localStorage.getItem('items') === null) {
      items = []
    } else {
      items = JSON.parse(localStorage.getItem('items'))
    }
    return items;

  }


  static getNums() {

    let inc = localStorage.getItem('inctotal');
    let exp = localStorage.getItem('exptotal');
    let over = localStorage.getItem('overall');
    let perc = localStorage.getItem('percent');


    return [inc, exp, over, perc]
  }


  static addBudgetItem(item) {
    const items = Store.getBudgetItems();

    //append item to array in local storage
    items.push(item)


    //convert WHOLE ARRAY of items to JSON and save to local storage
    localStorage.setItem('items', JSON.stringify(items))

    Store.setTotal()
    Store.setPerc()
  }


  //update all expense item percentages
  static setPerc() {
    const items = Store.getBudgetItems();

    items.map(x => {
      if (x.type === "exp") {
        x.perc = Math.round((x.value / Store.getNums()[0]) * 100) + '%'
        // console.log(`perc value is ${x.perc}`)
      }
    })

    //save updated items object to local stroage
    localStorage.setItem('items', JSON.stringify(items))


  }


  static removeBudgetItem(id) {
    const items = Store.getBudgetItems();


    items.forEach((item, index) => {

      //don't use strict comparsion; one of these guys might not be an integer
      //or could have used Number()
      if (item.id == id) {
        items.splice(index, 1);
      } else {

      }
    });


    localStorage.setItem('items', JSON.stringify(items))


    Store.setTotal()
    Store.setPerc()


  }


  static setTotal() {
    let inctotal = 0;
    let exptotal = 0;


    //all items, both expenses and income
    let itemArr = Store.getBudgetItems();

    for (let item of itemArr) {

      if (item.type === 'inc') {
        const intItem = parseFloat(item.value)
        inctotal += intItem
      } else if (item.type === 'exp') {
        const intItem = parseFloat(item.value)
        exptotal += intItem
      }

    }

    let overall = parseFloat((inctotal - exptotal))
    let percent = 0;

    if (exptotal == 0 || inctotal == 0) {
      percent = 0
    } else {
      percent = Math.round((exptotal / inctotal) * 100)
    }



    localStorage.setItem('inctotal', JSON.stringify(parseFloat(inctotal.toFixed(2))))
    localStorage.setItem('exptotal', JSON.stringify(parseFloat(exptotal.toFixed(2))))
    localStorage.setItem('overall', JSON.stringify(parseFloat(overall.toFixed(2))))
    localStorage.setItem('percent', JSON.stringify(parseFloat(percent.toFixed(2))))


  }




}





//Event: Display Items 

document.addEventListener('DOMContentLoaded', UI.displayItems)

//Event: Display Totals

document.addEventListener('DOMContentLoaded', UI.displayNums)



//Event: Add a budget item 

document.getElementById('add-btn').addEventListener('click', (e) => {

  e.preventDefault();


  //get input from from 
  const value = document.querySelector('.add__value').value;
  const desc = document.querySelector('.add__description').value;
  const type = document.querySelector('.add__type').value;
  let id = document.getElementById('income-list').rows.length + document.getElementById('expenses-list').rows.length + 1
  let perc = 0;

  if (type === 'exp') {
    perc = Math.round((value / Store.getNums()[0]) * 100)
  }

  //Validate form

  if (value === '' || desc == '') {
    UI.showAlert('Each field must contain a value', 'danger')
  } else {

    //instatiate a budget item 

    const item = new BudgetItem(value, desc, type, id, perc);


    //add budget item to UI
    UI.addItemToList(item);

    //add budget to local storage
    Store.addBudgetItem(item)

    // Show success message
    UI.showAlert('Budget item has been added', 'success')


    //show totals
    UI.displayNums()

    //display updated percentages
    UI.displayPerces()

    //Clear form fields. 
    UI.clearFields()

  }


});


//Event: Remove a budget item
document.getElementById('income-list').addEventListener('click', (evt) => {

  //remove budget item from list
  UI.deleteBudgetItem(evt.target)

  //remove item from store
  Store.removeBudgetItem(evt.target.parentElement.id)

  //show totals
  UI.displayNums()

  //Show updated percentages
  UI.displayPerces()



});

//Event: Remove a budget item
document.getElementById('expenses-list').addEventListener('click', (evt) => {

  //remove budget item from list
  UI.deleteBudgetItem(evt.target)


  //remove item from store
  Store.removeBudgetItem(evt.target.parentElement.id)

  //show totals
  UI.displayNums()


  //Show updated percentages
  UI.displayPerces()




});






//clear everything plus local storage

function clearStorage() {


  let incRows = document.getElementById('income-list')
  let expRows = document.getElementById('expenses-list')

  while (incRows.childNodes.length) {
    incRows.removeChild(incRows.childNodes[0])


  }
  while (expRows.childNodes.length) {
    expRows.removeChild(expRows.childNodes[0])

  }

  localStorage.clear()

  //Store.setTotal()
  UI.displayNums()

}


document.getElementById('clear').addEventListener('click', clearStorage)