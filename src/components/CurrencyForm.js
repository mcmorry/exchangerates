import React, { Component } from 'react';
import DatePicker from './DatePicker.js'

import "./currencyForm.css";

class CurrencyForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currency: this.props.currency,
      date: this.props.date
    }

    this.submit = this.submit.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  submit(e) {
    e.preventDefault();
    if (this.state.currency && this.state.date && this.props.onSubmit) this.props.onSubmit(this.state);
  }

  setCurrency(e) {
    this.setState({
      currency: e.target.value
    });
  }

  setDate(date) {
    this.setState({
      date: date
    });
  }

  render() {
    const options = this.props.currencies.map((cur) => {
      return <option key={cur}>{cur}</option>
    });

    return (
      <form id="currencyForm" onSubmit={this.submit}>
        <table>
          <tbody>
            <tr>
              <td>Base:</td>
              <td><select onChange={this.setCurrency} value={this.props.currency}>{options}</select></td>
            </tr><tr>
              <td>Date:</td>
              <td><DatePicker date={this.state.date} onChange={this.setDate} maxDate={new Date()} minDate={new Date(1999, 0, 4)}/></td>
            </tr><tr>
              <td></td>
              <td><input type="submit" value="Display"/></td>
            </tr>
          </tbody>
        </table>
      </form>
    );
  }
}

export default CurrencyForm;