import React from 'react'
import moment from 'moment'

export function extractDisplayDate(checklistItem, wedding) {
  let diffBound = 'months'
  let baseDate = moment().add(1, 'y') // FIXME: should this be one year from user creation?
  if(wedding !== undefined && wedding.date !== undefined) {
    baseDate = moment(wedding.date, 'MM/DD/YYYY hh:mm A')
  }
  let dueDate = checklistItem.date
  let displayDate = ''

  if(dueDate == undefined || dueDate == null ) {
    dueDate = moment(wedding.date, 'MM/DD/YYYY hh:mm A').subtract(checklistItem.daysBefore, 'days')

    if (checklistItem.daysBefore < 14) {
      diffBound = 'days'
    } else if (checklistItem.daysBefore < 30) {
      diffBound = 'weeks'
    } else {
      diffBound = 'months'
    }
    displayDate = `${baseDate.diff(dueDate, diffBound)} ${diffBound} before`
  } else {
    displayDate = moment(dueDate).format('MM/DD/YYYY hh:mm A')
  }

  return displayDate
}
