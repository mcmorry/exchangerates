import React, { Component } from 'react';
import './App.css';

import CurrencyForm from './components/CurrencyForm.js'
import CurrencyTable from './components/CurrencyTable.js'

class App extends Component {

  currencies = ['EUR', 'USD', 'GBP', 'AUD', 'CAD', 'JPY'];

  cache = {};

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      currency: 'EUR',
      exludedCurrency: null,
      rates: null
    };

    this.submit = this.submit.bind(this);
    this.setDate = this.setDate.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
    this.switchCurrency = this.switchCurrency.bind(this);
  }

  setDate(date) {
    this.setState({
      date: date
    });
  }
  
  setCurrency(currency) {
    this.setState({
      currency: currency
    });
  }
  
  submit() {
    this.loadData(this.state.date, this.state.currency);
  }

  switchCurrency(currency) {
    this.setCurrency(currency);
    this.loadData(this.state.date, currency);
  }

  formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  loadData(date, currency) {
    const dateYMD = this.formatDate(date);
    const cacheKey = dateYMD +  currency

    if (this.cache[cacheKey]) {
      this.setState({
        noData: false,
        rates: this.cache[cacheKey],
        exludedCurrency: currency,
      });
      return;
    }

    fetch('https://exchangeratesapi.io/api/' + dateYMD + '?base=' + currency)
      .then(res => res.json())
      .then(
        (result) => {
          // console.log(result);
          this.cache[cacheKey] = result.rates;
          this.setState({
            rates: result.rates,
            date: date,
            exludedCurrency: currency,
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }

  render() {
    let output = null;
    if (this.state.rates === null) {
      output = <h4>Please choose a date and a base currency</h4>
    } else {
      output = (
        <CurrencyTable 
          currencies={this.currencies.filter(cur => {return cur !== this.state.exludedCurrency})} 
          rates={this.state.rates}
          onSelectCurrency={this.switchCurrency}
        />
      );
    }

    return (
      <div className="App">
        <h1>Exchange Rates</h1>
        <div className="col1">
          <CurrencyForm 
            currencies={this.currencies} 
            currency={this.state.currency} 
            date={this.state.date} 
            onDateChange={this.setDate} 
            onCurrencyChange={this.setCurrency} 
            onSubmit={this.submit}
          />
        </div>
        <div className="col2">
          {output}
        </div>
      </div>
    );
  }
}

export default App;
