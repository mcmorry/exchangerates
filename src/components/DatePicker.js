import React, { Component } from 'react';

import "./datePicker.css";

class DatePicker extends Component {

  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  constructor(props) {
    super(props);
    
    this.state = {
      selectedDate: this.props.date,
      viewDate: this.props.date,
      popup: false
    };
    this.dateClick = this.dateClick.bind(this);
    this.selectCell = this.selectCell.bind(this);
    this.selectPrevMonth = this.selectPrevMonth.bind(this);
    this.selectNextMonth = this.selectNextMonth.bind(this);
  }

  dateClick() {
    this.setState({
      popup: !this.state.popup
    });
  }

  selectCell(cellId, disabled) {
    if (disabled) return;

    const cell = this.cells.filter(cell => 
      cell.id === cellId
    )[0];
    const date = new Date(cell.year, cell.month, cell.day);
    this.setState({
      selectedDate: date,
      viewDate: date,
      popup: false
    });
    if (this.props.onChange) this.props.onChange(date);
  }

  selectPrevMonth() {
    var date = new Date(this.state.viewDate);
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    this.setState({
      viewDate: date
    })
  }

  selectNextMonth() {
    var date = new Date(this.state.viewDate);
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    this.setState({
      viewDate: date
    })
  }

  daysInMonth (month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  startingWeekDay (month, year) {
    return new Date(year, month, 1).getDay();
  }

  getCells() {
    this.cells = [];
    const date = this.state.viewDate;
    const daysSelectedMonth = this.daysInMonth(date.getMonth(), date.getFullYear());
    const daysPrevMonth = this.daysInMonth(date.getMonth() - 1, date.getFullYear());
    const startingIndex = this.startingWeekDay(date.getMonth(), date.getFullYear());
    const endingIndex = startingIndex + daysSelectedMonth - 1;
    const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const todayDate = new Date();

    for (let index = 0; index < 7*6; index++) {
      let isSelectedMonth = index >= startingIndex && index <= endingIndex;
      let day = isSelectedMonth ? index - startingIndex + 1 : index < startingIndex ? daysPrevMonth - startingIndex + index + 1 : index - endingIndex;
      let month = isSelectedMonth ? date.getMonth() : index < startingIndex ? prevMonthDate.getMonth() : nextMonthDate.getMonth();
      let year = isSelectedMonth ? date.getFullYear() : index < startingIndex ? prevMonthDate.getFullYear() : nextMonthDate.getFullYear();
      let isToday = todayDate.getFullYear() === year && todayDate.getMonth() === month && todayDate.getDate() === day;
      let isSunday = new Date(year, month, day).getDay() === 0;
      let isSelectedDay = day === this.props.date.getDate() && month === this.props.date.getMonth() && year === this.props.date.getFullYear();

      // if (this.props.maxDate && new Date(year, month, day) > this.props.maxDate) break;
      let curDate = new Date(year, month, day);

      this.cells.push({
        id: index,
        isToday: isToday,
        isCurrentMonth: isSelectedMonth,
        isSelectedDay: isSelectedDay,
        isSunday: isSunday,
        day: day,
        month: month,
        year: year,
        disabled: (this.props.maxDate && curDate > this.props.maxDate) || (this.props.minDate && curDate < this.props.minDate)
      });
    }

    return this.cells.map((cell) => 
      <div className={
        "cell" + 
        (!cell.isCurrentMonth ? " external" : "") +
        (cell.isToday ? " today" : "") +
        (cell.isSelectedDay ? " selected" : "") + 
        (cell.isSunday ? " sunday" : "") +
        (cell.disabled ? " disabled" : "")
      } 
      key={cell.id}
      onClick={(e) => this.selectCell(cell.id, cell.disabled)}
      >{cell.day}</div>
    );
  }

  formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
  }

  render() {
    return (
        <div className="datePicker">
          <input readOnly type="text" value={this.formatDate(this.props.date)} onClick={this.dateClick}/>
          <div className={"popup" + (!this.state.popup ? " hidden" : "")}>
            <div className="monthPrev" onClick={this.selectPrevMonth}>&#x25C0;</div>
            <div className="month">{this.monthNames[this.state.viewDate.getMonth()]} {this.state.viewDate.getFullYear()}</div>
            <div className="monthNext" onClick={this.selectNextMonth}>&#x25B6;</div>
            <div className="grid">{this.getCells()}</div>
          </div>
        </div>
    );
  }
}

DatePicker.defaultProps = {
  date: new Date(),
  minDate: null,
  maxDate: null
}

export default DatePicker;