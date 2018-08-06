import React, { Component } from 'react';

import "./currencyTable.css";

class CurrencyTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sort: 'asc'
    }

    this.selectCurrency = this.selectCurrency.bind(this);
    this.changeSorting = this.changeSorting.bind(this);
  }

  selectCurrency(currency) {
    if (this.props.onSelectCurrency) this.props.onSelectCurrency(currency);
  }

  changeSorting() {
    this.setState((prevState, props) => ({
      sort: prevState.sort === 'asc' ? 'desc' : 'asc'
    }));
  }

  render() {
    if (!this.props.rates) return null;

    const rates = Object.keys(this.props.rates)
      .filter(key => this.props.currencies.includes(key))
      .reduce((res, key) => {
        const value = this.props.rates[key];
        res.push({
          currency: key,
          buy: (value * 0.95).toFixed(4),
          sell: (value * 1.05).toFixed(4)
        });
        return res;
      }, [])
      .sort((a, b) => (this.state.sort === 'asc' ? (a.currency < b.currency ? -1 : 1) : (a.currency < b.currency ? 1 : -1)))
      .map(row => {
        return (
          <tr key={row.currency} onClick={() => this.selectCurrency(row.currency)}>
            <td>{row.currency}</td>
            <td className="valueCol">{row.buy}</td>
            <td className="valueCol">{row.sell}</td>
          </tr>
        );
      });

    return (
      <table id="currecyTable">
        <thead>
          <tr>
            <th onClick={this.changeSorting} className={this.state.sort}>Currency</th><th>Buy</th><th>Sell</th>
          </tr>
        </thead>
        <tbody>
          {rates}
        </tbody>
      </table>
    );
  }
}

export default CurrencyTable;