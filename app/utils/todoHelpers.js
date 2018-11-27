import React from 'react'
import moment from 'moment'

export function calculateDate(todo, wedding) {
  let dueDate = moment().add(1, 'y').subtract(todo.days_before_wedding, 'days')

  if(wedding !== undefined && wedding.date !== undefined) {
    dueDate = moment(wedding.date, 'MM/DD/YYYY').subtract(todo.days_before_wedding, 'days')
  }

  if(todo.date !== undefined && todo.date !== '' && todo.date !== null) {
    dueDate = moment(todo.date, 'MM/DD/YYYY')
  }

  return dueDate
}

export function daysBetweenWedding(todo, wedding) {
  console.log(wedding.date)
  if(wedding == undefined || (wedding !== undefined && wedding.date == undefined) || (todo.date == undefined || todo.date == null)) {
    return todo.days_before_wedding
  } else if (todo.date !== undefined && todo.date !== null){
    console.log(todo.date)
    const dueDate = calculateDate(todo, wedding)
    const diff = moment(wedding.date, 'MM/DD/YYYY').diff(moment(todo.date, 'MM/DD/YYYY'), 'days')
    console.log(diff)
    return moment(wedding.date, 'MM/DD/YYYY').diff(moment(todo.date, 'MM/DD/YYYY'), 'days')
  } else {
    console.log('returning else')
    return 30 // FIXME HACK: when would the else ever be hit
  }
}
