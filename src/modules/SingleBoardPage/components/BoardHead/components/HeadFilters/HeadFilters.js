import { useState, useContext, useEffect, useRef } from 'react'

import TasksContext from '../../../../context/TasksContext'

import { Filter, Close } from '../../../../../../UI'
import './HeadFilters.css'

const HeadFilters = () => {
  const [isModal, setModal] = useState(false)
  const [isFilter, setFilter] = useState(false)

  const closeModal = () => {
    setModal(false)
  }

  useEffect(() => {
    const allSelected = JSON.parse(localStorage.getItem('allSelected'))
    const selectedFilter = JSON.parse(localStorage.getItem('selectedFilter'))

    if (!allSelected && selectedFilter === 'all') setFilter(false)
    else setFilter(true)
  }, [])

  const filterClass = `head-filter ${isModal || isFilter ? 'tool-btn' : null}`
  return (
    <div className="head-filter_wrapper">
      <div className={filterClass} onClick={() => setModal(true)}>
        <Filter />
        Filters
      </div>
      {isModal ? (
        <FilterModal
          isModal={isModal}
          closeModal={closeModal}
          setFilter={setFilter}
        />
      ) : null}
    </div>
  )
}

const FilterModal = ({ isModal, closeModal, setFilter }) => {
  const { taskFilter, setTaskFilter } = useContext(TasksContext)
  const modalRef = useRef(null)

  const onFilter = () => {
    const isCompletedChecked = document.querySelector('#completed').checked
    const isPendingChecked = document.querySelector('#pending').checked

    let selectedFilter
    if (isCompletedChecked && isPendingChecked) {
      selectedFilter = 'all'
      localStorage.setItem('allSelected', JSON.stringify(true))
    } else if (isCompletedChecked) {
      selectedFilter = 'completed'
      localStorage.setItem('allSelected', JSON.stringify(false))
    } else if (isPendingChecked) {
      selectedFilter = 'pending'
      localStorage.setItem('allSelected', JSON.stringify(false))
    } else {
      selectedFilter = 'all'
    }

    localStorage.setItem('selectedFilter', JSON.stringify(selectedFilter))
    if (taskFilter !== selectedFilter) {
      setFilter(true)
      setTaskFilter(selectedFilter)
    }
  }

  useEffect(() => {
    const selectedFilter = JSON.parse(localStorage.getItem('selectedFilter'))
    if (selectedFilter && selectedFilter !== 'all') {
      document.getElementById(selectedFilter).checked = true
    }

    const checkboxex = document.querySelectorAll('.filter-modal_label input')
    const allSelected = JSON.parse(localStorage.getItem('allSelected'))
    if (allSelected) {
      checkboxex.forEach((checkbox) => {
        checkbox.checked = true
      })
    }

    return () => {
      if (!allSelected && selectedFilter === 'all') setFilter(false)
      else setFilter(true)
    }
  }, [taskFilter])

  const handleClickOutside = (event) => {
    if (isModal) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal()
      }
    }
  }

  useEffect(() => {
    const root = document.querySelector('#root')
    if (isModal) {
      root.addEventListener('click', handleClickOutside)
    } else root.removeEventListener('click', handleClickOutside)
  }, [isModal])

  return (
    <div className="filter-modal_wrapper" ref={modalRef}>
      <div className="filter-modal_header">
        <div></div>
        <div>Filter</div>
        <div className="filter-modal_close" onClick={closeModal}>
          <Close />
        </div>
      </div>
      <div className="filter-modal_content">
        <h5>Status</h5>
        <ul>
          <li>
            <label className="filter-modal_label">
              <input type="checkbox" id="completed" onClick={onFilter} />
              <div>Marked as completed</div>
            </label>
          </li>
          <li>
            <label className="filter-modal_label">
              <input type="checkbox" id="pending" onClick={onFilter} />
              <div>Marked as not completed</div>
            </label>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default HeadFilters
